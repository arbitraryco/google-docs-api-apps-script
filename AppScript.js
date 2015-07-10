/*   
   Copyright (c) 2015 Arbitrary (http://arbitrary.io/)

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
*/


/* 
   Usage
   1. Open or create a new spreadsheet in Google Drive.
   2. Click on Tools -> Script Editor in the menu.
   3. Paste this script into the subsequent editor.
   4. Change "unique_sheet_id_name_here" to a unique name. This is located in 4 places in the script.
   4. Select "setUp" in the "Select Function" menu and click the Play icon. You'll need to do this twice - 1st time to grant access to Script Properties.
   5. Publish -> Deploy as Web App. Make sure to create a new version and follow the on-screen instructions.
   6. Copy the current web app URL in the resulting screen.
   7. Use the query parameter ?sheet=[name of sheet] to retreive information as a JSON array. Use ?sheet=[name of sheet]&object=true to retreive as a JSON object.
*/

function doPost(e) { // change to doPost(e) if you are recieving POST data
  var json = {};
  json["success"] = false;
  json["error"] = "Please send data via GET.";
  
  return ContentService.createTextOutput(JSON.stringify(json));
}

function doGet(e) {
  var json = {};
  json["success"] = false;
  json["error"] = "Please send data via POST.";

  var json = {};

  var ssId = PropertiesService.getScriptProperties().getProperty('UNIQUE_SHEET_ID_NAME_HERE');
  if(!ssId) {
    json["success"] = false;
    json["error"] = "Unable to load sheet. UNIQUE_SHEET_ID_NAME_HERE not set.";
    return ContentService.createTextOutput(JSON.stringify(json));    
  }
  
  var ss = SpreadsheetApp.openById(ssId);
  if(!ss) {
    json["success"] = false;
    json["error"] = "Unable to load sheet. UNIQUE_SHEET_ID_NAME_HERE doesn't exist.";
    return ContentService.createTextOutput(JSON.stringify(json));    
  }
  
  var locale = e.parameter["locale"];
  
  var sheet = ss.getSheetByName(locale);
  if(!sheet) {
    sheet = ss.getSheetByName("en_us");
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; //read headers
  var vals = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  // combine
  if(e.parameter["object"] == "true") {
      var strings = {};
      for(var i=0;i<vals.length;i++) {
        strings[ vals[i][0] ] = vals[i][1];
      }
      json["data"] = strings;
  }
  else {
    var data = [];
    for(var i=0;i<vals.length;i++) {
      var row = {};
      for(var j=0;j<headers.length;j++) {
        row[ headers[j] ] = vals[i][j];
      }
    
      data.push(row);
    }
    
    json["data"] = data;
  }

  json["success"] = true;
  return ContentService.createTextOutput(JSON.stringify(json));    
}

//http://www.google.sc/support/forum/p/apps-script/thread?tid=345591f349a25cb4&hl=en
function setUp() {
  PropertiesService.getScriptProperties().setProperty('UNIQUE_SHEET_ID_NAME_HERE', SpreadsheetApp.getActiveSpreadsheet().getId());
}