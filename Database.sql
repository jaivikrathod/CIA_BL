-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2025 at 02:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `care_insurance`
--

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `primary_mobile` varchar(20) NOT NULL,
  `is_active` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`id`, `user_id`, `full_name`, `email`, `primary_mobile`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 8, 'Jaivik', 'jaivikrathod7@gmail.com', '9191919919', 1, '2025-05-08 23:08:39', '2025-05-18 14:11:27'),
(3, 9, 'Shivangi', 'shivangi7@gmail.com', '9181818181', 0, '2025-05-08 23:08:39', '2025-05-18 16:23:56'),
(6, 9, 'sdsd', 'oso@sjk.com', '0202929292', 1, '2025-05-16 00:40:12', '2025-05-18 14:24:19'),
(7, 8, 'nxnxn', 'jj@jj.com', '9393993939', 1, '2025-05-16 00:40:23', '2025-05-18 14:11:27'),
(8, 8, 'kkpl', 'ko@ko.com', '2222222222', 0, '2025-05-16 00:42:57', '2025-05-18 16:24:44');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `documents` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `primary_mobile` varchar(15) DEFAULT NULL,
  `additional_mobile` varchar(15) DEFAULT NULL,
  `full_address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `user_id`, `documents`, `full_name`, `gender`, `dob`, `email`, `primary_mobile`, `additional_mobile`, `full_address`, `city`, `state`, `is_active`, `created_at`, `update_at`) VALUES
(1, 8, '', 'David Wise', 'male', '1988-04-12', 'user1@example.com', '9931229533', '8683906185', '49918 Brenda Bridge, West Alan, TN 62254', 'Torresborough', 'Louisiana', 0, '2025-05-05 22:31:50', '2025-05-18 16:25:52'),
(2, 9, '', 'Roberto Evans', 'male', '1995-08-17', 'user2@example.com', '9182572099', '8923681436', '12731 Shane Views Suite 544, Johnsonborough, MO 91104', 'Jeffreyland', 'Maryland', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(3, 10, '', 'Catherine Carr', 'female', '2003-01-24', 'user3@example.com', '9907161204', '8714324740', '98253 Edward Plaza, Michaelchester, NM 84861', 'Tamaramouth', 'Rhode Island', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(4, 11, '', 'Charles Mitchellll', 'male', '1997-11-23', 'user4@example.com', '9910653236', '8544342069', '80513 Taylor Turnpike Suite 758, Jenniferbury, MI 79119', 'Brooksmouth', 'Massachusetts', 1, '2025-05-05 22:31:50', '2025-07-05 20:12:29'),
(5, 12, '', 'Richard Warner', 'male', '1994-05-12', 'user5@example.com', '9593052805', '8580271654', '032 Greer Tunnel Apt. 546, Danielsshire, OH 18313', 'New Erik', 'Connecticut', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(6, 8, '', 'Sonya Horn', 'female', '2001-06-17', 'user6@example.com', '9645323612', '8894521847', '6306 John Mall, Lauraville, IL 06294', 'West Tylerberg', 'New York', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(7, 9, '', 'Patrick Rivera', 'male', '1998-11-02', 'user7@example.com', '9939448408', '8920915703', '58734 Lisa Forge Apt. 927, North Monicastad, HI 18604', 'West Joelland', 'Idaho', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(8, 10, '', 'Stephanie Bell', 'female', '1987-03-25', 'user8@example.com', '9905936043', '8625232082', '842 Miranda Parkway, Browntown, TN 94936', 'Bryantfort', 'West Virginia', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(9, 11, '', 'Maria Carter', 'female', '2001-07-26', 'user9@example.com', '9887372034', '8587169993', '523 Vincent Skyway, Andersonchester, CO 60599', 'North Spencer', 'Utah', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(10, 12, '', 'Denise Murphy', 'female', '2003-11-02', 'user10@example.com', '9226770370', '8610913633', 'USNS Cooper, FPO AE 24177', 'North Frances', 'Georgia', 1, '2025-05-05 22:31:50', '2025-05-17 23:31:29'),
(11, 8, '', 'Travis Thomas', 'male', '2003-01-19', 'user11@example.com', '9156033597', '8271327869', '1799 Jodi Path, North Seanside, VA 96107', 'Vargasville', 'New Mexico', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(12, 9, '', 'Laura Armstrong', 'female', '2000-12-01', 'user12@example.com', '9382427376', '8867860877', '570 Tina Ways, Port Meganside, RI 32226', 'Nicholasside', 'Idaho', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(14, 10, '', 'Jocelyn Gilmore', 'female', '2001-12-08', 'user14@example.com', '9664537208', '8759987635', '5575 Evans Squares, Lake Ericland, LA 89206', 'Lake Matthew', 'Hawaii', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(15, 11, '', 'Brett Parks', 'male', '1999-07-16', 'user15@example.com', '9511998362', '8292292122', '543 Lisa Isle, Morrisonville, MD 31168', 'Smithmouth', 'Washington', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(16, 12, '', 'Randy Sullivan', 'male', '1997-10-05', 'user16@example.com', '9143060518', '8661229203', '986 Nancy Wall Suite 899, Robinsonborough, WV 91617', 'Carlfurt', 'Massachusetts', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(17, 8, '', 'Marie Graham', 'female', '2006-07-08', 'user17@example.com', '9222982887', '8279257488', '912 Lee Courts, West Catherinebury, MI 06155', 'Priceville', 'Illinois', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(18, 9, '', 'Nicholas Juarez', 'male', '1992-05-17', 'user18@example.com', '9701429171', '8835009764', 'Unit 6715 Box 1972, DPO AA 30243', 'New Robertbury', 'Oklahoma', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(19, 10, '', 'Michelle Kline', 'female', '2004-08-24', 'user19@example.com', '9292436659', '8224019376', '6380 Linda Street, East Katherine, WI 96558', 'Jonesland', 'New Mexico', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(20, 11, '', 'Kristie Garcia', 'female', '1987-08-20', 'user20@example.com', '9585757605', '8187557623', '66459 Samuel Drives, Espinozafurt, NH 45819', 'Carlshire', 'Louisiana', 0, '2025-05-05 22:31:50', '2025-05-11 13:16:15'),
(21, 12, '', 'dinesh', 'male', '2000-12-12', 'dd@dd.com', '9292929292', '2929292929', 'sdefds', 'Ahmedabad', 'Gujarat', 0, '2025-05-05 23:53:21', '2025-05-11 13:16:15'),
(22, 8, '', 'kuku', 'male', '2000-12-12', 'kukur@gmail.com', '9292929291', '2929929292', 'sfddfd', 'ahmedabas', 'gujrat', 0, '2025-05-05 23:55:29', '2025-05-05 23:55:29'),
(23, 8, '', 'jethalal', 'male', '2000-12-12', 'jethya@gmail.com', '2929292929', '2929292929', 'weds', 'wew', 'we', 1, '2025-07-05 19:55:00', '2025-07-05 19:55:00'),
(24, 8, '', 'www', 'male', '2000-12-12', 'w@ww', '2222222222', '2222222222', 'w', 'w', 'w', 1, '2025-07-05 20:02:10', '2025-07-05 21:10:11'),
(25, 8, '', 'testing', 'male', '2000-12-12', 'testing@teseeet.com', '2929299911', '2819192838', 'edhfbc', 'edkfjh', 'dfkch', 1, '2025-07-05 22:21:58', '2025-07-05 22:21:58');

-- --------------------------------------------------------

--
-- Table structure for table `insurance_common_details`
--

CREATE TABLE `insurance_common_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `segment` varchar(20) NOT NULL,
  `vehicle_number` varchar(20) NOT NULL,
  `insurance_type` varchar(20) NOT NULL,
  `segment_vehicle_type` varchar(20) NOT NULL,
  `segment_vehicle_detail_type` varchar(20) NOT NULL,
  `model` varchar(20) NOT NULL,
  `manufacturer` varchar(20) NOT NULL,
  `fuel_type` varchar(20) NOT NULL,
  `yom` int(4) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance_common_details`
--

INSERT INTO `insurance_common_details` (`id`, `user_id`, `customer_id`, `segment`, `vehicle_number`, `insurance_type`, `segment_vehicle_type`, `segment_vehicle_detail_type`, `model`, `manufacturer`, `fuel_type`, `yom`, `is_active`, `status`, `created_at`, `updated_at`) VALUES
(3, 8, 10, 'Private Car', 'GJ01VE1302', 'Motor', 'ThirdParty', 'wewewe', 'Accord', 'Honda', 'diesel', 2020, 1, 0, '2025-05-18 17:56:33', '2025-05-18 19:04:19'),
(4, 8, 6, 'WC Insurance', '', 'Non-Motor', '-', '-', '', '', '', 0, 1, 0, '2025-05-18 19:09:19', '2025-06-21 23:32:29'),
(5, 8, 23, 'Private Car', 'GJ01VE1302', 'Motor', 'SAOD', 'wewe', 'Camry', 'Toyota', 'petrol', 2025, 1, 0, '2025-07-05 22:22:39', '2025-07-05 22:22:51'),
(6, 8, 25, 'Commercial', '', 'Motor', 'GCV', 'djfnkajnd', '', '', '', 0, 1, 0, '2025-07-05 22:32:54', '2025-07-05 22:33:26');

-- --------------------------------------------------------

--
-- Table structure for table `insurance_details`
--

CREATE TABLE `insurance_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `insurance_id` int(11) NOT NULL,
  `common_id` varchar(255) NOT NULL,
  `insurance_date` datetime NOT NULL DEFAULT current_timestamp(),
  `documents` varchar(255) NOT NULL,
  `business_type` varchar(20) NOT NULL,
  `idv` varchar(20) NOT NULL,
  `currentncb` varchar(20) NOT NULL,
  `insurance_company` varchar(20) NOT NULL,
  `policy_no` varchar(20) NOT NULL,
  `od_premium` int(11) NOT NULL,
  `tp_premium` int(11) NOT NULL,
  `package_premium` int(11) NOT NULL,
  `gst` int(11) NOT NULL,
  `premium` int(11) NOT NULL,
  `collection_date` datetime NOT NULL,
  `case_type` varchar(30) NOT NULL,
  `exe_name` varchar(50) NOT NULL,
  `payment_mode` int(11) NOT NULL,
  `policy_start_date` datetime NOT NULL,
  `policy_expiry_date` datetime NOT NULL,
  `agent_code` varchar(50) NOT NULL,
  `payout_percent` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `tds` int(11) NOT NULL,
  `tds_amount` int(11) NOT NULL,
  `payment_amount` int(11) NOT NULL,
  `difference` int(11) NOT NULL,
  `final_agent` int(11) NOT NULL,
  `net_income` int(11) NOT NULL,
  `payment_received` tinyint(1) NOT NULL,
  `insurance_count` int(11) NOT NULL,
  `step` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance_details`
--

INSERT INTO `insurance_details` (`id`, `user_id`, `customer_id`, `insurance_id`, `common_id`, `insurance_date`, `documents`, `business_type`, `idv`, `currentncb`, `insurance_company`, `policy_no`, `od_premium`, `tp_premium`, `package_premium`, `gst`, `premium`, `collection_date`, `case_type`, `exe_name`, `payment_mode`, `policy_start_date`, `policy_expiry_date`, `agent_code`, `payout_percent`, `amount`, `tds`, `tds_amount`, `payment_amount`, `difference`, `final_agent`, `net_income`, `payment_received`, `insurance_count`, `step`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 8, 0, 4, '9e74f761-f281-4bab-b79d-36b5e252116f', '2025-01-18 19:43:03', '[{\"name\":\"1_1750527869844_sunny (1).jpeg\",\"type\":\"Forms\"}]', '', '1', '1', '1', '1', 1, 1, 1, 1, 1, '0001-01-01 00:00:00', '1', '1', 1, '0001-01-01 00:00:00', '0001-01-01 00:00:00', '6', 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, '2025-05-18 19:43:03', '2025-06-21 23:14:29');

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(50) NOT NULL,
  `otp` char(6) NOT NULL,
  `valid_till` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`user_id`, `token`, `created_at`, `updated_at`) VALUES
(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiamFpdmlrcmF0aG9kN0BnbWFpbC5jb20iLCJpYXQiOjE3NTE3MTM5NTYsImV4cCI6MTc1MTgwMDM1Nn0.OuMvXJHzXNXywIHvbznH0PzK3D07S9FDo79Q2e61cjY', '2025-05-17 23:27:24', '2025-07-05 16:42:36'),
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiamFpdmlrcmF0aG9kOEBnbWFpbC5jb20iLCJpYXQiOjE3NDc1NTgzOTQsImV4cCI6MTc0NzY0NDc5NH0.B2GiOvQUH1UrkUc9q1IGAYSyXg8_z10bBsoelMERg_k', '2025-05-17 23:27:24', '2025-05-18 14:23:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `full_name` varchar(20) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `type`, `full_name`, `mobile`, `email`, `password`, `is_active`, `created_at`, `updated_at`) VALUES
(8, 'Admin', 'jaivik', '9173164696', 'jaivikrathod7@gmail.com', '$2a$10$b07oxgMrUv8UxqEWs9rW/eKnr6rRFDkjMqBlHLbP3DR3su0ChBGP.', 1, '2025-05-17 23:26:38', '2025-07-05 17:23:57'),
(9, 'Sub-admin', 'df', '1882288228', 'jaivikrathod8@gmail.com', '$2a$10$ZXewmahKGljBOAFhPKG0reylsQZzbStCIGsWMb8ABQim2xWGgziEe', 1, '2025-05-17 23:26:38', '2025-05-18 14:20:49'),
(10, 'Sub-admin', 'hfhdhdh', '9173164691', 'jaivik7@gmail.com', '$2a$10$tC1tSVttfFtFgi/ZIkwCF.3xsP7nTHv9hrxTc118tjOh7.crTryLe', 1, '2025-05-17 23:26:38', '2025-05-18 14:05:48'),
(11, 'Admin', 'youyo', '06353232109', 'gasecon945@magpit.com', '$2a$10$Jr18Mwc2Iy/cGU2kmrCbVO4NltnB4sC4Hh5eButq/OnDvIYo6Wxp2', 1, '2025-05-17 23:26:38', '2025-05-18 14:05:48'),
(12, 'Sub-admin', 'shd', '9999999999', 'd@dd.com', '$2a$10$8ciBlJ04VotywB/wyKO28uZQ1K5BQMMaT75iGA4hnmbAlnhEGDJ0C', 1, '2025-05-17 23:26:38', '2025-05-18 14:05:48'),
(13, 'Sub-admin', 'nnmn', '2929292929', 'nn@nn.com', '$2a$10$TN7wGLsE6/7TBGUgq7jh1eb5gfDsAWkAakWc7aGX19TwKr643pMOK', 0, '2025-05-17 23:26:38', '2025-05-18 16:28:17'),
(14, 'Sub-admin', 'temp', '1121221212', 'temp@t', '$2a$10$9pLR.F3FnMveDvPFgCESjeL/S6grgWS5XB9EnRw7fYvv0Bk62r0zS', 1, '2025-07-05 16:43:22', '2025-07-05 16:43:22'),
(15, 'Sub-admin', 'test', '1121121212', 'test@test', '$2a$10$Lq55YnOVvy1LNpGUwDLe9O4BlwtPGPqC1BRqzx3b7yEl7aJIpBWgO', 1, '2025-07-05 16:45:57', '2025-07-05 16:45:57'),
(16, 'Sub-admin', 'ewe', '2222222222', 'qw@we', '$2a$10$iJTdkPxPQ78tyZqBocryZuq/GmhSwho3tUm0j4DJx9oAmlMhSIS9.', 1, '2025-07-05 16:47:03', '2025-07-05 16:47:03'),
(17, 'Sub-admin', 'cssssf', '2929292920', 'we@we3', '$2a$10$McNbjdqLdz3.x4xUaEaN0ukb1m5C57csSFfLGj8APnMeaozIhAgE6', 1, '2025-07-05 16:49:20', '2025-07-05 16:49:20'),
(18, 'Sub-admin', 'wqw', '2333333333', 'qw@rere', '$2a$10$SXA8krj.OxDOD3ANytyaqOk319F4prKr6oHwNuEmuI4H0FI37SoKK', 1, '2025-07-05 16:50:28', '2025-07-05 16:50:28'),
(19, 'Sub-admin', 'wewewe', '3333333333', 'ewewewe@ewe', '$2a$10$Uw/pMA99vkhurtipYxvQ6.5SCRiyRX9xSUpBSB0x2fNLSQr0fLuPO', 1, '2025-07-05 16:51:28', '2025-07-05 16:51:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insurance_common_details`
--
ALTER TABLE `insurance_common_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insurance_details`
--
ALTER TABLE `insurance_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile` (`mobile`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `insurance_common_details`
--
ALTER TABLE `insurance_common_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `insurance_details`
--
ALTER TABLE `insurance_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
