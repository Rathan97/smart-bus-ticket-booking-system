
    function cpassword()
    {
        var password = document.getElementById("password").value;
        var cpassword = document.getElementById("confirm-password").value;
        if( password != cpassword)
        {
            alert("Password do not match !!");

            return false;
        }

        
    }

    document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const mobilenumber = document.getElementById("mobilenumber").value;
    const password = document.getElementById("password").value;

    insertData(fullname,email,mobilenumber,password);

    });


