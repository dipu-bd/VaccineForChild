-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2016 at 06:31 PM
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
(1, 0, 86400000, 1, 'Dose 1'),
(2, 28, 86400000, 1, 'Dose 2'),
(3, 112, 86400000, 1, 'Dose 3'),
(4, 42, 86400000, 2, 'Dose 1'),
(5, 70, 86400000, 2, 'Dose 2'),
(6, 98, 86400000, 2, 'Dose 3');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dose`
--
ALTER TABLE `dose`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dose__vaccine` (`vaccine`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dose`
--
ALTER TABLE `dose`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `dose`
--
ALTER TABLE `dose`
  ADD CONSTRAINT `fk_dose__vaccine` FOREIGN KEY (`vaccine`) REFERENCES `vaccine` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
