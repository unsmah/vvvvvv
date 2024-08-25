<script>
  (function() {
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbwKf-nFwfzfHLNACumV16XWTH5RXMwicIFsylqtVPWBU0JgiaxQ0LzY1REFLTi-N_aw/exec';
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;
      document.getElementById('profileLink').href = `URL_TO_USER_PROFILE_PAGE/${user.id}`;
    } else {
      document.querySelector('.dropdown').style.display = 'none';
    }

    function logout() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        fetch(`${webAppUrl}?action=logout&id=${user.id}`)
          .then(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('redirected');
            window.location.reload();
          })
          .catch(error => {
            console.error('Logout error:', error);
          });
      }
    }

    // Toggle dropdown on click
    document.getElementById('userButton').addEventListener('click', function() {
      document.getElementById('myDropdown').classList.toggle('show');
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
      if (!event.target.matches('.dropbtn') && !event.target.matches('.avatar')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    });

    window.logout = logout;
  })();
</script>
