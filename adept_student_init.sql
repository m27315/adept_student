-- phpMyAdmin SQL Dump
-- version 4.0.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 23, 2013 at 02:29 AM
-- Server version: 5.5.32-log
-- PHP Version: 5.5.5-pl0-gentoo

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `adept_student`
--
-- CREATE DATABASE IF NOT EXISTS `adept_student` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `adept_student`;

-- --------------------------------------------------------

--
-- Table structure for table `config`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Oct 23, 2013 at 02:26 AM
--

DROP TABLE IF EXISTS `config`;
CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `name`, `value`) VALUES
(1, 'created', '2010-04-26 14:27:38'),
(2, 'updated', '2013-10-22 21:26:27'),
(3, 'title', 'Online Bible Study and Correspondence Course'),
(4, 'description', '&lt;p&gt;Now it&#039;s your turn! You have looked through our &lt;a href=&quot;/articles/index.html&quot;&gt;interlinked articles&lt;/a&gt; and &lt;a href=&quot;/audio/index.html&quot;&gt;listened to Bible audio lessons&lt;/a&gt;. You are now ready to determine some answers of your own.&lt;/p&gt; &lt;p&gt;The following interactive lessons are offered as an opportunity to open your Bible and complete our Online Bible Correspondence Course. You can complete these lessons in any order, but we would recommend you start with the first lesson, since each lesson builds upon the first two lessons.&lt;/p&gt;'),
(5, 'footer', '&lt;p&gt;What do you think of our Bible correspondence course series?  Would you like to see additional series and lessons?  Please &lt;a href=&quot;../contact.php&quot; target=&quot;_blank&quot;&gt;contact us&lt;/a&gt; with your feedback.  It is greatly appreciated&lt;/p&gt;'),
(6, 'global_meta', 'Insert Your Global Meta Includes Here'),
(7, 'global_header', 'Insert Your Global Header Here'),
(8, 'global_footer', 'Insert Your Global Footer Here');

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `lessons`;
CREATE TABLE IF NOT EXISTS `lessons` (
  `lesson_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `title` varchar(512) NOT NULL,
  `description` text,
  `header` text,
  `footer` text,
  `section_id` int(11) NOT NULL,
  `ordinal` int(11) NOT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `title` (`title`(333))
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `created`, `updated`, `title`, `description`, `header`, `footer`, `section_id`, `ordinal`) VALUES
(1, '2011-09-10 15:34:28', '2011-09-10 15:34:28', 'some title', 'some description', 'some header', 'some footer', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `options`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `options`;
CREATE TABLE IF NOT EXISTS `options` (
  `question_id` int(11) NOT NULL,
  `ordinal` int(11) NOT NULL,
  `default` tinyint(1) NOT NULL,
  `text` varchar(128) NOT NULL,
  KEY `question_id` (`question_id`,`ordinal`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `pages`;
CREATE TABLE IF NOT EXISTS `pages` (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `title` varchar(512) NOT NULL,
  `description` text,
  `header` text,
  `footer` text,
  `lesson_id` int(11) NOT NULL,
  `ordinal` int(11) NOT NULL,
  PRIMARY KEY (`page_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`page_id`, `created`, `updated`, `title`, `description`, `header`, `footer`, `lesson_id`, `ordinal`) VALUES
(1, '2011-09-10 15:34:28', '2011-09-10 15:34:28', 'some title', 'some description', 'some header', 'some footer', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `questions`;
CREATE TABLE IF NOT EXISTS `questions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `preface` text NOT NULL,
  `question` varchar(2048) NOT NULL,
  `hint` varchar(1024) NOT NULL,
  `answer` text NOT NULL,
  `explanation` text NOT NULL,
  `type` enum('text','textarea','checkbox','radio','select') NOT NULL,
  `page_id` int(11) NOT NULL,
  `ordinal` int(11) NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `type` (`type`),
  KEY `page_id` (`page_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `created`, `updated`, `preface`, `question`, `hint`, `answer`, `explanation`, `type`, `page_id`, `ordinal`) VALUES
(1, '2011-09-10 15:34:28', '2011-09-10 15:34:28', 'some preface', 'some question', 'some hint', 'some answer', 'some explanation', 'text', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `responses_long`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `responses_long`;
CREATE TABLE IF NOT EXISTS `responses_long` (
  `response_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `ordinal` int(11) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`response_id`),
  KEY `question_id` (`question_id`,`ordinal`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `responses_short`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `responses_short`;
CREATE TABLE IF NOT EXISTS `responses_short` (
  `response_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `ordinal` int(11) NOT NULL,
  `value` varchar(512) NOT NULL,
  PRIMARY KEY (`response_id`),
  KEY `question_id` (`question_id`,`ordinal`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `section_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `title` varchar(512) NOT NULL,
  `description` text,
  `footer` text,
  `series_id` int(11) NOT NULL,
  `ordinal` int(11) NOT NULL,
  PRIMARY KEY (`section_id`),
  KEY `title` (`title`(333))
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`section_id`, `created`, `updated`, `title`, `description`, `footer`, `series_id`, `ordinal`) VALUES
(1, '2011-05-07 23:30:09', '2011-05-12 19:33:57', 'The Roles of God and Man in Salvation', '&lt;p&gt;Religious opinions vary concerning the extent of man&#039;s efforts in salvation.  Can man even influence his eternal destiny?  His man accountable for his actions?  Before we study what man must do to be saved, it is critical to determine if man &lt;em&gt;can&lt;/em&gt; do anything to be saved.  (This 3-lesson series overviews many of the proof-texts for Calvinism.&lt;/p&gt;', '', 1, 2),
(2, '2011-05-10 00:06:27', '2011-05-12 19:33:57', 'The Foundation of any Bible Study ', 'Common ground is critical to any discussion.  Likewise, all spiritual conversations must be built on a shared spiritual foundation.  Discover God&#039;s standard for all Bible studies.', '', 1, 1),
(3, '2011-05-10 00:06:27', '2011-05-12 19:33:57', 'God&#039;s Plan of Salvation ', 'What must I do to be saved?  Study what the Bible teaches we all must do to avoid hell and go to heaven!', '', 1, 3),
(20, '2011-09-10 22:26:43', '2011-09-10 22:26:43', 'some title', 'some description', 'some footer', 4, 1),
(16, '2011-05-10 00:27:09', '2011-05-12 19:33:57', 'The Church', 'Does God care which church I attend?  Explore Bible passages that direct the mission, authority, offices, and organization of the New Testament church.', '', 1, 4),
(17, '2011-05-10 00:27:09', '2011-05-12 19:33:57', 'The Sermon on the Mount', 'The ultimate sermon on the nature of the kingdom&#039;s citizens.  Study Jesus&#039; great lecture about the righteousness required of us, which exceeded the righteousness proscribed by the scribes and Pharisees of His day.', '', 1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `series`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Oct 23, 2013 at 02:26 AM
--

DROP TABLE IF EXISTS `series`;
CREATE TABLE IF NOT EXISTS `series` (
  `series_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `title` varchar(512) NOT NULL,
  `description` text,
  `footer` text,
  `ordinal` int(11) NOT NULL,
  PRIMARY KEY (`series_id`),
  KEY `title` (`title`(333))
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `series`
--

INSERT INTO `series` (`series_id`, `created`, `updated`, `title`, `description`, `footer`, `ordinal`) VALUES
(1, '2011-05-07 23:30:09', '2013-10-22 21:26:27', 'For Salvation and Unity', '&lt;p&gt;How do Christians study the Bible and determine God&#039;s will?  How can we become Christians?  What is the pattern for the Lord&#039;s church?  These questions are the heart of our first Bible study series.  Let us sit down and study how the Lord answers us from the pages of His inspired Word.&lt;/p&gt;', '', 1),
(2, '2011-09-10 22:01:40', '2013-10-22 21:26:27', 'Textual Studies', '&lt;p&gt;All Scriptures are inspired of God and are therefore profitable for our learning; however, the following lessons focus on select passages, because of their cherished teaching, difficulty in interpretation, or common interest.&lt;/p&gt;', 'Unfortunately, all of these lessons are not yet available. The new lessons will be posted as each is completed.', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
-- Creation: Apr 15, 2013 at 04:18 PM
-- Last update: Apr 15, 2013 at 04:18 PM
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `name` varchar(128) NOT NULL,
  `address` varchar(256) NOT NULL,
  `city` varchar(128) NOT NULL,
  `state` varchar(128) NOT NULL,
  `zip` varchar(32) NOT NULL,
  `country` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `ip` varchar(39) NOT NULL,
  `mac` varchar(16) NOT NULL,
  `token` varchar(64) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `email` (`email`,`ip`,`mac`,`token`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
