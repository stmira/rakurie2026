-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:3306
-- 生成日時: 2026-10-26 06:30:45
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

--
-- テーブルのデータのダンプ `purchase_orders`
--

INSERT INTO `purchase_orders` (`purchase_orders_id`, `customer_id`, `supplier_id`, `quantity`, `summary`, `arrival_date`) VALUES
(1, 1, 1, 120, 'H130', '2026-10-20'),
(2, 2, 2, 48, 'H105', '2026-10-27'),
(3, 4, 3, 60, 'H145', '2026-10-29'),
(4, 3, 4, 80, 'H120', '2026-11-02'),
(5, 5, 5, 36, 'H100', '2026-11-05'),
(6, 6, 6, 24, 'H150', '2026-11-09'),
(7, 7, 7, 95, 'H110', '2026-11-10'),
(8, 8, 8, 32, 'H135', '2026-11-12'),
(9, 9, 9, 18, 'H125', '2026-11-16'),
(10, 10, 10, 140, 'H140', '2026-11-20');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`purchase_orders_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
