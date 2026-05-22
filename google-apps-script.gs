// Google Apps Script to receive registration submissions and append them to a Google Sheet.
// Deploy this as a Web App and paste the generated URL into register.html.

const SHEET_ID = '1Fq3apDD1U_l09hdjxa2qM-CfjZ8EVfeqkVmu20kn2CA';
const SHEET_NAME = 'Registration'; // Change if your sheet has a different tab name.


function getTargetSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
}

function createJsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return createJsonOutput({ status: 'ok' });
}

function doGet(e) {
  return createJsonOutput({ status: 'ok', message: 'Web app is reachable' });
}

function sendNotificationEmail(payload) {
  const emailBody = `
      <h2>New Registration Submitted</h2>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
        <tr><th align="left">Student Name</th><td>${payload.studentName || ''}</td></tr>
        <tr><th align="left">Phone</th><td>${payload.phone || ''}</td></tr>
        <tr><th align="left">Email</th><td>${payload.email || ''}</td></tr>
        <tr><th align="left">Age</th><td>${payload.age || ''}</td></tr>
        <tr><th align="left">Gender</th><td>${payload.gender || ''}</td></tr>
        <tr><th align="left">Course Name</th><td>${payload.courseName || ''}</td></tr>
        <tr><th align="left">Payment Method</th><td>${payload.paymentMethod || ''}</td></tr>
        <tr><th align="left">Fee</th><td>${payload.fee || ''}</td></tr>
        <tr><th align="left">Country</th><td>${payload.country || ''}</td></tr>
        <tr><th align="left">Notes</th><td>${payload.notes || ''}</td></tr>
        <tr><th align="left">Submitted At</th><td>${payload.submittedAt || ''}</td></tr>
      </table>
    `;

  const emailSubject = `New Registration - ${payload.studentName || 'New student'} - ${new Date().toISOString()} - ${payload.courseName || 'No course'}`;
  const plainBody = 'A new registration was submitted. See HTML details for the full information.';

  Logger.log('Sending registration email to hafizamubarahazeem@gmail.com');
  Logger.log('Email subject: ' + emailSubject);
  Logger.log('Email body preview: ' + emailBody.substring(0, 200));

  MailApp.sendEmail('hafizamubarahazeem@gmail.com', emailSubject, plainBody, { htmlBody: emailBody });
  Logger.log('MailApp notification sent to hafizamubarahazeem@gmail.com');
}

function doPost(e) {
  try {
    const payload = (e.postData && e.postData.type === 'application/json') ? JSON.parse(e.postData.contents || '{}') : e.parameter || {};
    const sheet = getTargetSheet();
    if (!sheet) {
      throw new Error(`Sheet not found: ${SHEET_NAME}`);
    }

    const row = [
      payload.studentName || '',
      payload.phone || '',
      payload.email || '',
      payload.age || '',
      payload.gender || '',
      payload.courseName || '',
      payload.paymentMethod || '',
      payload.fee || '',
      payload.country || '',
      payload.notes || '',
      payload.submittedAt || '',
    ];

    sheet.appendRow(row);
    sendNotificationEmail(payload);

    return createJsonOutput({ status: 'success' });
  } catch (error) {
    return createJsonOutput({ status: 'error', message: error.message });
  }
}

