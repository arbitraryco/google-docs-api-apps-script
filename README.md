Google Drive Spreadsheet export as JSON
============

New Google Spreadsheets don't [easily] support publish to web as CSV. This apps script creates lightweight support for doing so, but instead of CSV we're exporting it as JSON for easier traversing and use in code.

Usage
------- 
1. Open or create a new spreadsheet in Google Drive.
2. Click on Tools -> Script Editor in the menu.
3. Paste this script into the subsequent editor.
4. Change "unique_sheet_id_name_here" to a unique name. This is located in 4 places in the script.
4. Select "setUp" in the "Select Function" menu and click the Play icon. You'll need to do this twice - 1st time to grant access to Script Properties.
5. Publish -> Deploy as Web App. Make sure to create a new version and follow the on-screen instructions.
6. Copy the current web app URL in the resulting screen.
7. Use the query parameter ?sheet=[name of sheet] to retreive information as a JSON array. Use ?sheet=[name of sheet]&object=true to retreive as a JSON object.
