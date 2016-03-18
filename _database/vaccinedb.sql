-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2016 at 08:38 PM
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
  `height` decimal(12,2) DEFAULT NULL,
  `weight` decimal(12,2) DEFAULT NULL,
  `user` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `child`
--

INSERT INTO `child` (`id`, `dob`, `name`, `height`, `weight`, `user`) VALUES
(4, 1388599200000, 'Bishwa', '3.60', '1.74', 6),
(8, 1426874400000, 'Tipu', '5.00', '4.00', 6),
(11, 1455645600000, 'Nirob', '4.00', '3.00', 6);

-- --------------------------------------------------------

--
-- Table structure for table `dose`
--

CREATE TABLE IF NOT EXISTS `dose` (
  `id` int(11) NOT NULL,
  `dab` int(11) NOT NULL,
  `vaccine` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

-- --------------------------------------------------------

--
-- Table structure for table `phone`
--

CREATE TABLE IF NOT EXISTS `phone` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `number` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

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
  `address` varchar(100) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `uname`, `email`, `password`, `confirmed`, `access`, `name`, `address`) VALUES
(6, 'dipu', 'dipu.sudipta@gmail.com', '112358', 1, 0, 'Sudipto Chandra', 'Moyna Monjil, Modina Market, Sylhet, Bangladesh'),
(7, 'test', 'test@gmail.com', 'testtest', 0, 0, NULL, NULL),
(9, 'polo', 'sudipto.bd@hotmail.com', '123456', 0, 0, NULL, NULL),
(10, 'bishwa', 'bishwa420@gmail.com', '112358', 0, 0, NULL, NULL),
(11, 'new', 'new@gmail.com', 'newpass', 0, 0, 'New Name', 'My Full Address'),
(12, 'nirob', 'nirob@sds.com', 'nirob', 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vaccine`
--

CREATE TABLE IF NOT EXISTS `vaccine` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

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
-- Indexes for table `phone`
--
ALTER TABLE `phone`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD KEY `idx_phone__user` (`user`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `dose`
--
ALTER TABLE `dose`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `phone`
--
ALTER TABLE `phone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `vaccine`
--
ALTER TABLE `vaccine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `child`
--
ALTER TABLE `child`
  ADD CONSTRAINT `fk_child__user` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

--
-- Constraints for table `dose`
--
ALTER TABLE `dose`
  ADD CONSTRAINT `fk_dose__vaccine` FOREIGN KEY (`vaccine`) REFERENCES `vaccine` (`id`);

--
-- Constraints for table `phone`
--
ALTER TABLE `phone`
  ADD CONSTRAINT `fk_phone__user` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
