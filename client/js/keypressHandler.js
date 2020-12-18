
  const serverUrl = 'http://127.0.0.1:3000';

  const fetchCommand = (command) => {
    $.ajax({
      type: 'GET',
      data: command,
      url: serverUrl,
      success: () => {
        SwimTeam.move(command);
      }
    });
  };


$('body').on('keydown', (event) => {
  var arrowPress = event.key.match(/Arrow(Up|Down|Left|Right)/);
  if (arrowPress) {
    var direction = arrowPress[1];
    fetchCommand(direction.toLowerCase());
    SwimTeam.move(direction.toLowerCase());
  }
});

console.log('Client is running in the browser!');
