const serverUrl = 'http://127.0.0.1:3000';

//
// TODO: build the swim command fetcher here
//
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



(function() {

  // create the valid commands array
  const directions = ['left', 'right', 'up', 'down'];

   // create a function to generate random int
  const getRandomInt = (min, max) => {
    return Math.random() * (max - min) + min;
  }

  let swimSchedule;

  const startSwim = () => {
    let randomInt = Math.round(getRandomInt(0, directions.length - 1));
    let randomMove = directions[randomInt];

    fetchCommand(randomMove);
    swimSchedule = setTimeout(startSwim, 1000);
  }

  // call swimmers to start swimming
  startSwim();


  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: 'http://127.0.0.1:3000/background.jpg',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();
