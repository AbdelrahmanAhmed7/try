// The Meta CAPI access token is NOT stored in source code for security.
// It is read at runtime from Google Apps Script Script Properties
// (Project Settings → Script Properties → key: META_ACCESS_TOKEN).
var META_PIXEL_ID = '2211139682969128';

var HEADERS = [
  'التاريخ',
  'الوقت',
  'الاسم',
  'الموبايل',
  'المحافظة',
  'العنوان',
  'ملاحظات',
  'العرض',
  'النكهات',
  'الكمية',
  'السعر',
];

// ── CORS preflight: browsers send OPTIONS before POST cross-origin.
// Apps Script doesn't natively handle OPTIONS, so we return 200 immediately.
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Endpoints
// POST is the ONLY method that creates orders (avoids the 302-redirect
// double-execution that GET requests cause on Apps Script web apps, and
// prevents order creation / CAPI firing through a plain URL visit).
function doPost(e) { return handleRequest(e); }

// GET MUST NOT create orders, append to the Sheet, or call Meta CAPI.
// It only returns a harmless status response.
function doGet(e) {
  return jsonOutput({ result: 'ok', message: 'Healthy & Tasty order API' });
}

function handleRequest(e) {
  // ── Parse the POST body (JSON preferred; URL params as a fallback).
  var p = {};
  if (e.postData && e.postData.contents) {
    try {
      p = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      p = e.parameter || {};
    }
  } else {
    p = e.parameter || {};
  }

  // Guard against a malformed body (e.g. JSON "null") before validation.
  if (!p || typeof p !== 'object') p = {};

  // ── Server-side validation BEFORE any lock, Sheet write, or CAPI call.
  // Invalid requests are rejected without acquiring the lock.
  var validationError = validateOrder(p);
  if (validationError) {
    return jsonOutput({ result: 'error', error: validationError });
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonOutput({ result: 'error', error: 'Could not acquire lock' });
  }

  try {
    var orderId = (p.orderId || '').trim();

    // ── Dedup check (inside the lock, so it's race-condition safe).
    if (isDuplicate(orderId)) {
      Logger.log('Duplicate orderId rejected: ' + orderId);
      return jsonOutput({ result: 'duplicate', orderId: orderId, shouldTrackPixel: false });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }

    var now  = new Date();
    var date = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var time = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');

    sheet.appendRow([
      date,
      time,
      p.name     || '',
      p.phone    || '',
      p.gov      || '',
      p.address  || '',
      p.notes    || '',
      p.bundle   || '',
      p.flavors  || '-',
      p.quantity || '1',
      p.price ? (p.price + ' جنيه') : '',
    ]);

    sendMetaPurchase(p, orderId, now);

    return jsonOutput({ result: 'success', orderId: orderId, eventId: orderId, shouldTrackPixel: true });

  } catch (err) {
    Logger.log('Error: ' + err.message);
    return jsonOutput({ result: 'error', error: err.message });
  } finally {
    lock.releaseLock();
  }
}

// ── Server-side input validation. Returns an error message, or null if valid.
// Mirrors the frontend's accepted Egyptian mobile format (^01[0-9]{9}$).
// Returns a generic error so no field details are leaked to callers.
// Must NOT log the submitted phone/name/address.
function validateOrder(p) {
  var orderId = (p.orderId || '').trim();
  var name    = (p.name || '').trim();
  var phone   = (p.phone || '').trim().replace(/[\s\-]/g, '');
  var gov     = (p.gov || '').trim();
  var address = (p.address || '').trim();

  if (!orderId)                     return 'Invalid request';
  if (!name)                        return 'Invalid request';
  if (!/^01[0-9]{9}$/.test(phone))  return 'Invalid request';
  if (!gov)                         return 'Invalid request';
  if (!address)                     return 'Invalid request';
  return null;
}

function sendMetaPurchase(p, orderId, eventTime) {
  try {
    // price is now sent as a clean numeric string (e.g. "199")
    var value = parseFloat(p.price || '0') || 0;

    var rawPhone = (p.phone || '').replace(/[\s\-]/g, '');
    if (rawPhone.startsWith('0')) rawPhone = '2' + rawPhone;

    // Build user_data — include fbp & fbc when provided by the browser.
    // These cookies are essential for Meta to deduplicate this CAPI event
    // against the browser Pixel event sharing the same event_id (orderId).
    var userData = {
      ph: [hashSHA256(rawPhone)],
    };
    if (p.fbp) userData.fbp = p.fbp;
    if (p.fbc) userData.fbc = p.fbc;

    var eventData = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(eventTime.getTime() / 1000),
        event_id: orderId,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          currency: 'EGP',
          value: value,
          order_id: orderId,
          content_type: 'product',
        },
      }],
    };

    var options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(eventData),
      muteHttpExceptions: true,
    };

    // Token is read from Script Properties at runtime — never stored in code.
    var token   = getMetaAccessToken();
    var capiUrl = 'https://graph.facebook.com/v19.0/' + META_PIXEL_ID + '/events?access_token=' + token;

    var response = UrlFetchApp.fetch(capiUrl, options);
    Logger.log('Meta CAPI response: ' + response.getContentText());

  } catch (err) {
    Logger.log('Meta CAPI error: ' + err.message);
  }
}

// ── Reads the Meta access token from Google Apps Script Script Properties.
// Never log or return this value.
function getMetaAccessToken() {
  var token =
    PropertiesService.getScriptProperties()
      .getProperty('META_ACCESS_TOKEN');

  if (!token) {
    throw new Error('META_ACCESS_TOKEN is not configured');
  }

  return token;
}

function hashSHA256(value) {
  if (!value) return '';
  var normalized = value.toString().toLowerCase().trim();
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    normalized,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
}

function getDedupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dedup = ss.getSheetByName('_dedup');
  if (!dedup) {
    dedup = ss.insertSheet('_dedup');
    dedup.hideSheet();
  }
  return dedup;
}

function isDuplicate(orderId) {
  var dedup = getDedupSheet();
  var lastRow = dedup.getLastRow();

  if (lastRow > 0) {
    var startRow = Math.max(1, lastRow - 999);
    var numRows  = lastRow - startRow + 1;
    var values   = dedup.getRange(startRow, 1, numRows, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      if (String(values[i][0]).trim() === orderId) return true;
    }
  }

  // Write to dedup sheet BEFORE returning — so if we crash after this
  // but before appendRow, we don't write a duplicate on retry.
  dedup.appendRow([orderId, new Date().toISOString()]);
  return false;
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
