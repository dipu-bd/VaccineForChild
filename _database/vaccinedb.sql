-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2016 at 09:49 PM
-- Server version: 5.6.25
-- PHP Version: 5.6.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vaccinedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `child`
--

CREATE TABLE IF NOT EXISTS `child` (
  `id` int(11) NOT NULL,
  `dob` bigint(20) NOT NULL,
  `name` varchar(60) DEFAULT NULL,
  `gender` varchar(10) NOT NULL DEFAULT 'male',
  `height` decimal(12,2) DEFAULT NULL,
  `weight` decimal(12,2) DEFAULT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `child`
--

INSERT INTO `child` (`id`, `dob`, `name`, `gender`, `height`, `weight`, `user`) VALUES
(8, 1426874400000, 'Amrito Das Tipu', 'male', '9.15', '3.30', 6),
(11, 1455645600000, 'Mehedi Hasan Nirob', 'male', '10.65', '3.00', 6),
(16, 1458237600000, 'Node JS', 'female', '4.00', '1.00', 6),
(17, 1455991200000, 'my child', 'female', '100.00', '25.00', 12),
(18, 1459015200000, 'hello', 'male', '34.00', '34.00', 12);

-- --------------------------------------------------------

--
-- Table structure for table `dose`
--

CREATE TABLE IF NOT EXISTS `dose` (
  `id` int(11) NOT NULL,
  `dab` bigint(20) NOT NULL DEFAULT '0',
  `period` bigint(20) NOT NULL DEFAULT '86400000',
  `vaccine` int(11) NOT NULL,
  `name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `dose`
--

INSERT INTO `dose` (`id`, `dab`, `period`, `vaccine`, `name`) VALUES
(1, 0, 86400000, 1, 'Dose 1'),
(2, 2592000000, 2592000000, 1, 'Dose 2'),
(3, 15552000000, 25920000000, 1, 'Dose 3'),
(4, 5184000000, 5184000000, 2, 'Dose 1'),
(5, 10368000000, 5184000000, 2, 'Dose 2'),
(6, 15552000000, 7776000000, 2, 'Dose 3'),
(7, 5184000000, 864000000, 3, '1st Dose'),
(8, 10368000000, 864000000, 3, '2nd Dose'),
(9, 38880000000, 864000000, 3, '4rth Dose'),
(10, 5184000000, 5184000000, 6, '1st dose'),
(11, 10368000000, 5184000000, 6, '2nd dose'),
(12, 15552000000, 23328000000, 6, '3rd dose'),
(13, 15552000000, 23328000000, 7, 'Annual vaccination'),
(14, 31536000000, 5184000000, 8, '1st dose'),
(15, 31104000000, 5184000000, 9, '1st dose'),
(16, 31104000000, 10368000000, 10, '2nd dose'),
(17, 15552000000, 7776000000, 11, 'Tdap'),
(18, 31104000000, 15552000000, 12, 'Tdap'),
(19, 31104000000, 12960000000, 13, '3rd dose');

-- --------------------------------------------------------

--
-- Table structure for table `taken`
--

CREATE TABLE IF NOT EXISTS `taken` (
  `id` int(11) NOT NULL,
  `child` int(11) NOT NULL,
  `dose` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taken`
--

INSERT INTO `taken` (`id`, `child`, `dose`) VALUES
(33, 8, 2),
(34, 8, 1),
(35, 8, 4),
(36, 17, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL,
  `uname` varchar(35) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(25) NOT NULL,
  `confirmed` tinyint(1) DEFAULT '0',
  `access` int(11) DEFAULT '0',
  `name` varchar(60) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `informed` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `uname`, `email`, `password`, `confirmed`, `access`, `name`, `address`, `phone`, `informed`) VALUES
(6, 'dipu', 'dipu.sudipta@gmail.com', '112358', 1, 0, 'Sudipto Chandra', 'Moyna Monjil, Modina Market, Sylhet, Bangladesh', '+8801759687204', 1459068739334),
(9, 'polo', 'dipu.sudipto@hotmail.com', '123456', 1, 1, 'Apolo Mission', 'None what so ever.', NULL, 0),
(10, 'bishwa', 'bishwa420@gmail.com', '00000', 0, 0, 'Bishwa', NULL, '+8801621924710', 0),
(11, 'talha', 'talhaqc@gmail.com', 'talha', 0, 0, 'talha', NULL, NULL, 0),
(12, 'Biswa', 'biswapriyo.chakrabarty@gmail.com', 'ajaj', 1, 0, 'Biswa', '', '+8801612300990', 1459069811399);

-- --------------------------------------------------------

--
-- Table structure for table `vaccine`
--

CREATE TABLE IF NOT EXISTS `vaccine` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `vaccine`
--

INSERT INTO `vaccine` (`id`, `title`) VALUES
(1, 'Hepatitis B (HepB)'),
(2, 'Rotavirus (RV)'),
(3, 'Diphtheria (DTaP)'),
(4, 'Haemophilus influenzae b (Hib)'),
(5, 'Pneumococcal conjugate (PCV13)'),
(6, 'Inactivated poliovirus'),
(7, 'Influenza'),
(8, 'Mumps'),
(9, 'Varicella'),
(10, 'Hepatitis A'),
(11, 'Tetanus'),
(12, 'acellular pertussis'),
(13, 'Human papillomavirus');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `child`
--
ALTER TABLE `child`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_child__name` (`name`),
  ADD KEY `idx_child__user` (`user`);

--
-- Indexes for table `dose`
--
ALTER TABLE `dose`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dose__vaccine` (`vaccine`);

--
-- Indexes for table `taken`
--
ALTER TABLE `taken`
  ADD PRIMARY KEY (`id`),
  ADD KEY `child_id` (`child`),
  ADD KEY `dose_id` (`dose`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uname` (`uname`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_user__address` (`address`),
  ADD KEY `idx_user__name` (`name`);

--
-- Indexes for table `vaccine`
--
ALTER TABLE `vaccine`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `child`
--
ALTER TABLE `child`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `dose`
--
ALTER TABLE `dose`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `taken`
--
ALTER TABLE `taken`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `vaccine`
--
ALTER TABLE `vaccine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `child`
--
ALTER TABLE `child`
  ADD CONSTRAINT `fk_child__user` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dose`
--
ALTER TABLE `dose`
  ADD CONSTRAINT `fk_dose__vaccine` FOREIGN KEY (`vaccine`) REFERENCES `vaccine` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `taken`
--
ALTER TABLE `taken`
  ADD CONSTRAINT `fk_taken_child` FOREIGN KEY (`child`) REFERENCES `child` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_taken_dose` FOREIGN KEY (`dose`) REFERENCES `dose` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
