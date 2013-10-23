# Introduction

**Adept Student** provides an online correspondence course taking web application.  It could easily be used as test-taking or survey-taking application.  Its primary focus is feature rich ease of use for the administrator and student alike.

A given installation may have multiple "series" for the student to take.  Each series can be subdivided into "sections", and each "section" is subdivided into actual "lessons".  Each "lesson" should be designed to be completed in a single seating (15-60 minutes).  Each lesson is comprised of potentially multiple "pages", where each page may have multiple "questions".  Virtually every object (series, sections, lessons, pages, and questions) has a description and footer field.  Depending on the question type (fill-in-the-blank, multiple-choice, true-false, etc.), the test-taking portion may "respond" with prepared answers.  The application may also provide hints to the student for a given question, when requested by clicking on the "Hint" button.

# Goals
The primary purposes of this web app are to:

1. Accelerate the response time for people taking correspondence courses.
2. Ease the "grading" burden for people administering correspondence courses.
3. Provide an easier method to modify an existing correspondence course.
4. Provide statistics and other insights for the administrator's education.
5. Provide a simpler, more fluid interface for the student.
6. Replace arcane, archaic formmail.pl scripts and long HTML form submissions.

# Status
Since this project is in its early infancy, please do **not** use this application in any application environment.

# Software Dependencies
A traditional [LAMP](http://en.wikipedia.org/wiki/LAMP_\(software_bundle\)):

* Web Server (preferrably, Apache)
* PHP 5
* MySQL 5

# Installation
1. Download and unpack software to web-server directory using the icons on this page, or by cloning directly from Github.

2. Create a separate MySQL database and user for this app.

3. Inside the `adept_student` directory, copy `config.sample.php` to `config.php`.

4. Edit the new `config.php` to match your MySQL database and user credentials.

5. In your web-browser, visit:  `http://<your_web_domain>/adept_student/edit.php`

Currently, classes may only be edited (edit.php).  The actual survey taking portion (index.php) has not been developed yet.

# Feedback
This project is in its early infancy and needs **LOTS** of work.  Feel free to contribute patches (via pull requests) and feedback (via issues).

# Roadmap

Here are a list of TODO items in no particular order:

* Switch to using jQuery instead of home-brewed Javascript functions.
* Switch to using AJAX instead of HTML form (POST) submission to continually save changes.
* Develop a prettier CSS styling.
* Consider switching from PHP to Python.
* Develop survey taking portion of app.
* Develop survey reporting statistics.
* Develop an optional login system for resuming long classes and viewing past results.
* Develop an optional login system (or document Apache password/deny system) to firewall course editing from course taking.
* Develop a web-based installation script, similar to phpBB and other PHP web-apps.
* Develop a theme installation and switcher, similar to Wordpress.
