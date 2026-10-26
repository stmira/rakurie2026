-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:3306
-- 生成日時: 2026-10-22 03:17:29
-- サーバのバージョン： 5.7.24
-- PHP のバージョン: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `rakurakku`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `employees`
--

CREATE TABLE `employees` (
  `employee_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` int(11) NOT NULL,
  `department_name` char(3) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `summary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_date` date NOT NULL,
  `production` tinyint(1) NOT NULL,
  `small_itme` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `double_check` tinyint(1) NOT NULL,
  `small_double_check` tinyint(1) NOT NULL,
  `drawing` int(11) NOT NULL,
  `drawing_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `post_l` int(11) NOT NULL,
  `post_l_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `post_t` int(11) NOT NULL,
  `post_t_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base` int(11) NOT NULL,
  `base_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arm` int(11) NOT NULL,
  `arm_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `angle` int(11) NOT NULL,
  `angle_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `a_base` int(11) NOT NULL,
  `a_base_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_1` int(11) NOT NULL,
  `other_1_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_2` int(11) NOT NULL,
  `other_2_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_3` int(11) NOT NULL,
  `other_3_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_4` int(11) NOT NULL,
  `other_4_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_5` int(11) NOT NULL,
  `other_5_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brace` int(11) NOT NULL,
  `brace_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `purchase_orders_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `summary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrival_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `schedules`
--

CREATE TABLE `schedules` (
  `schedule_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `task_id` int(11) NOT NULL,
  `detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `actual_start_date` date DEFAULT NULL,
  `actual_end_date` date DEFAULT NULL,
  `planned_start_date` date NOT NULL,
  `planned_end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_id` int(11) NOT NULL,
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `task_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- テーブルのインデックス `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);

--
-- テーブルのインデックス `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- テーブルのインデックス `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`purchase_orders_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- テーブルのインデックス `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `task_id` (`task_id`);

--
-- テーブルのインデックス `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- テーブルのインデックス `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`);

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- テーブルの制約 `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- テーブルの制約 `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`);
COMMIT;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
