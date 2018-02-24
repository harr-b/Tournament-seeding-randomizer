/*
1. Finds amount of entries (Seeds)
2. Generates a list of random numbers from 1 to 1000 in column L
3. Chooses a random row, and then chooses the value in that row in column X which is a list of random numbers
4. Cross-references the numbers picked by each team to see the closest team based on the team's first number
5. Seeds are assigned to teams starting at the 1 seed, and increasing with each added team.
6. Once a team gets seeded, their numbers are no longer compared to the random number.
7. Each team is then formally assigned a seed, and that is displayed in column F
*/
function onOpen(){
  var ui = SpreadsheetApp.getActiveSpreadsheet(); 
  var entries = [{name: "Run", functionName: "main"}];
  ui.addMenu("Seed Generator", entries);
}
//end onOpen

// 1. Amount of seeds in the tournament
function main() {
  var allData = SpreadsheetApp.getActiveSheet().getRange("A2:D50").getValues();
  var row = 0;
  var rowsLeft = true;
  var rowData;
  var seeds = 0;
  
  //Run through allData and calculates number of seeds in tournament
  while(rowsLeft){
    rowData = allData[row];

    //Checks if there are rows left to add
    if((rowData[0] == "") && (rowData[1] == "") && (rowData[2] == "") && (rowData[3] == "")){
      rowsLeft = false;
      break;
    }
    seeds++;
    row++;
  }
  
  //Clears previous cells
  for(var row = 2; row < seeds+5; row++){
    SpreadsheetApp.getActiveSheet().getRange(row, 6).setValue("");
    SpreadsheetApp.getActiveSheet().getRange(row, 8).setValue("");
    SpreadsheetApp.getActiveSheet().getRange(row, 9).setValue("");
    SpreadsheetApp.getActiveSheet().getRange(row, 10).setValue("");
    SpreadsheetApp.getActiveSheet().getRange(row, 11).setValue("");
    SpreadsheetApp.getActiveSheet().getRange(row,7).setValue("");

  }
  
  //Calls method to generate the list of random numbers in column X
  generatecolumnL();
  
  //Calls method to generate random rows.
  generateRandomRow(seeds);
}
//end main

// 2. Generates a list of random numbers from 1 to 1000 in column X
function generatecolumnL(){
  //Loop generates 999 random numbers listed in column X
  for(var i = 2; i < 1001; i++) {
     SpreadsheetApp.getActiveSheet().getRange(i, 12).setValue(Math.random() * (1000-1)+1);
  }
}
//end generatecolumnL

// 3. Chooses Random rows from column L by generating random numbers
// This is done for each seed, until the process is finished.
function generateRandomRow(seeds){
  var columnL = SpreadsheetApp.getActiveSheet().getRange("L2:L1000").getValues();
  var seedsAdded = 0;
  
  //Generates random row, and adds data to the proper cells
  for(var row = 2; row < seeds+2; row++){
    var randomRow = Math.floor(Math.random() * (1000-2)+2);
    var randomNum = columnL[randomRow-2];
    seedsAdded++;
    SpreadsheetApp.getActiveSheet().getRange(row, 10).setValue(randomRow);
    SpreadsheetApp.getActiveSheet().getRange(row,11).setValue(randomNum);
  
    //Calls method that computes the team that is the closest to the random number
    closestTeam(seedsAdded, seeds, randomNum);
    SpreadsheetApp.getActiveSheet().getRange(row,9).setValue(seedsAdded);
  }
}
//end generateRandomRow

// 4. Cross references the numbers picked by each team, and assigns seeds to the closest teams to the random number
function closestTeam(seedsAdded, seeds, number){
  var upperLimit = seeds+1;
  var teamData = SpreadsheetApp.getActiveSheet().getRange("A2:F50").getValues();
  var closestRow;
  var differenceToBeat = 1000;
  var difference;
  
  //Loops through entries to determine which team is closest to the random number.
  //Only Scans through teams that have not already been seeded.
  for(var row = 0; row < seeds+1; row++){
    var rowData = teamData[row];
    
    //Makes sure team has not already been seeded
    if(rowData[5] === ""){
      var guess = rowData[2];
      difference = Math.abs(number - guess);
      
      //Checks if team is closer than any other team so far
      if(difference < differenceToBeat){
        tie = false;
        differenceToBeat = difference;
        closestRow = row+2;
        //Prints the difference between the winning team and the random number
        SpreadsheetApp.getActiveSheet().getRange(closestRow,7).setValue(difference);
      }
    }
  }
  
  //Adds the proper seed to the proper cell
  SpreadsheetApp.getActiveSheet().getRange(closestRow,6).setValue(seedsAdded);

}
//end closestTeam
