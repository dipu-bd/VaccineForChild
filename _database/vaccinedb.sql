-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2016 at 07:46 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `child`
--

INSERT INTO `child` (`id`, `dob`, `name`, `gender`, `height`, `weight`, `user`) VALUES
(8, 1426874400000, 'Amrito Das Tipu', 'male', '9.15', '3.30', 6),
(11, 1455645600000, 'Mehedi Hasan Nirob', 'male', '10.65', '3.00', 6),
(16, 1458237600000, 'Node JS', 'female', '4.00', '1.00', 6);

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `dose`
--

INSERT INTO `dose` (`id`, `dab`, `period`, `vaccine`, `name`) VALUES
(1, 0, 0, 1, 'Dose 1'),
(2, 28, 0, 1, 'Dose 2'),
(3, 112, 0, 1, 'Dose 3'),
(4, 42, 0, 2, 'Dose 1'),
(5, 70, 0, 2, 'Dose 2'),
(6, 98, 0, 2, 'Dose 3');

-- --------------------------------------------------------

--
-- Table structure for table `taken`
--

CREATE TABLE IF NOT EXISTS `taken` (
  `id` int(11) NOT NULL,
  `child` int(11) NOT NULL,
  `dose` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `uname`, `email`, `password`, `confirmed`, `access`, `name`, `address`, `phone`) VALUES
(6, 'dipu', 'dipu.sudipta@gmail.com', '112358', 1, 0, 'Sudipto Chandra', 'Moyna Monjil, Modina Market, Sylhet, Bangladesh', NULL),
(9, 'polo', 'dipu.sudipto@hotmail.com', '123456', 1, 1, 'Apolo Mission', 'None what so ever.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vaccine`
--

CREATE TABLE IF NOT EXISTS `vaccine` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `vaccine`
--

INSERT INTO `vaccine` (`id`, `title`) VALUES
(1, 'Hepatitis B'),
(2, 'Rotavirus');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `dose`
--
ALTER TABLE `dose`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `taken`
--
ALTER TABLE `taken`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `vaccine`
--
ALTER TABLE `vaccine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
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
