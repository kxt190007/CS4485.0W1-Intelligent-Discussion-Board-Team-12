<?php
include 'connect.php';
session_start();
if(isset($_POST['submit'])) {
    echo 'a';
    $connect = Connect();
    $email = $_POST['email'];
    $pass = $_POST['password'];

    $sql = mysqli_query($connect, "SELECT * FROM Users WHERE Email = '$email' AND Password = '$pass'") or die('query failed');

    if (mysqli_num_rows($sql) > 0) {
        $_SESSION['user_id'] = mysqli_fetch_assoc($sql)['UserID'];
    } else {
        $error[] = 'Incorrect email or password.';
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Page Title</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- import css -->
    <link rel="stylesheet" href="style.css" />
    <script
        src="https://kit.fontawesome.com/bd841fcfd5.js"
        crossorigin="anonymous"
    ></script>

    <!-- import js -->
    <script src="/login.js" defer></script>
    <script src="/logSignUp.js" defer></script>
</head>

<body>
<h1>
    <center>Loginpage</center>
</h1>

<nav>
    <center>
        <li><a href="./index.html">Home</a></li>
        <li><a href="./login.html">Login</a></li>
        <!-- <li><a href="./create.html">Create</a></li> -->
    </center>
</nav>

<body class="login">
<div class="form-box">
    <h2>Log In</h2>
    <form class="loginForm" action = "" method="post">
        <?php
        if(isset($error)){
            foreach($error as $error){
                echo $error;
            }
        }
        ?>
        <div class="input-group">
            <i class="fa-solid fa-user"></i>

            <input
                type="email"
                name = 'email'
                id="LogE"
                class="user"
                placeholder="Your Email"
            />
            <span class="error"></span>
            <input
                type="password"
                name = 'password'
                id="LogP"
                class="pass"
                placeholder="Password"
            />
            <span class="error"></span>
        </div>
        <input type="submit" name="submit" value="login now">
    </form>
</div>
</body>


<!--<body class="signup">-->
<!--<div class="form-box">-->
<!--    <h2>Sign Up</h2>-->
<!---->
<!--    <form class="signUpForm">-->
<!--        <div class="input-group">-->
<!--            <i class="fa-solid fa-user"></i>-->
<!--            <input-->
<!--                type="email"-->
<!--                id="SignE"-->
<!--                class="user"-->
<!--                placeholder="Your Email"-->
<!--            />-->
<!--        </div>-->
<!--        <span class="error"></span>-->
<!--        <div class="input-group">-->
<!--            <i class="fa-solid fa-lock"></i>-->
<!--            <input-->
<!--                type="password"-->
<!--                id="SignP"-->
<!--                class="pass"-->
<!--                placeholder="Password"-->
<!--            />-->
<!--        </div>-->
<!--        <p>-->
<!--            Lost password <a href="#">Click Here!</a>-->
<!--        </p>-->
<!--        <span class="error"></span>-->
<!--        <div class="SignButton">-->
<!--            <button type="submit">Sign Up</button>-->
<!--            <button type="submit" class="disable">Log in</button>-->
<!--        </div>-->
<!--    </form>-->
<!--</div>-->
</body>
</html>
