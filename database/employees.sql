-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:3306
-- 生成日時: 2026-11-10 05:15:38
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
-- テーブルの構造 `employees`
--

CREATE TABLE `employees` (
  `employee_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` int(11) NOT NULL,
  `department_name` char(3) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `employees`
--

INSERT INTO `employees` (`employee_name`, `password_hash`, `email`, `employee_id`, `department_name`) VALUES
('田中 太郎', '$2y$10$RakurakkuTestSalt0001ux6WIP3fmwwOsr8y0/yQ.HquH48MXVjC', 'tanaka@example.jp', 1, '生産部'),
('佐藤 花子', '$2y$10$RakurakkuTestSalt0002u4nOWuySfzLY9zFGHgcnITWoIxfoVfc6', 'sato@example.jp', 2, '生産部'),
('鈴木 一郎', '$2y$10$RakurakkuTestSalt0003u7Bt47e/2GcArvkr8M9tS.ewmKYhFFGG', 'suzuki@example.jp', 3, '生産部'),
('高橋 美咲', '$2y$10$RakurakkuTestSalt0004uOUhR0jP7fmnpE8FAgFIcKFFBt9fcyxu', 'takahashi@example.jp', 4, '生産部'),
('伊藤 健太', '$2y$10$RakurakkuTestSalt0005uTEupf5T/lgBN94GCSmRUXhPZ7gIN17m', 'ito@example.jp', 5, '生産部'),
('渡辺 直子', '$2y$10$RakurakkuTestSalt0006uwaZJfp4kEfTnuunxVT.F8SgVaWjKZRu', 'watanabe@example.jp', 6, '営業部'),
('山本 翔太', '$2y$10$RakurakkuTestSalt0007uflHJWxk939XbaSQ3eAktpkIrSSwCjwG', 'yamamoto@example.jp', 7, '営業部'),
('中村 由紀', '$2y$10$RakurakkuTestSalt0008uermp19.IyH0K9QiRN1RxTVt0IGBVdW.', 'nakamura@example.jp', 8, '営業部'),
('小林 誠', '$2y$10$RakurakkuTestSalt0009uQ4XZXNE.p1ABtb8AbWctRnEhmIXL0/G', 'employee09@example.invalid', 9, '生産部'),
('加藤 亮', '$2y$10$RakurakkuTestSalt0010uz/2soTXQTJ79k4xO77dOS0RIyl0RtWC', 'employee10@example.invalid', 10, '生産部'),
('吉田 健', '$2y$10$RakurakkuTestSalt0011ujRkdwO5rhXjiouiK/L4UPUCynx1gTQS', 'employee11@example.invalid', 11, '生産部'),
('山田 美奈', '$2y$10$RakurakkuTestSalt0012uxO7PpPp8IRAOJsnmQR5nNObqsXL/qry', 'employee12@example.invalid', 12, '生産部'),
('斎藤 拓也', '$2y$10$RakurakkuTestSalt0013ukdvzr.Jc1QSm3kchbDhKKFBIYpxsaSW', 'employee13@example.invalid', 13, '生産部'),
('井上 由美', '$2y$10$RakurakkuTestSalt0014uDj/qBVO1S1AqvHaWk5kBvhKxFM/rM3u', 'employee14@example.invalid', 14, '生産部'),
('木村 直人', '$2y$10$RakurakkuTestSalt0015ulumM5xPgES5CMJ8AD5gmfZ9X8bZ35W2', 'employee15@example.invalid', 15, '営業部'),
('林 恵', '$2y$10$RakurakkuTestSalt0016up4AyLoH3lWeQrU41N9IrIs1vnHozY4a', 'employee16@example.invalid', 16, '営業部'),
('清水 大輔', '$2y$10$RakurakkuTestSalt0017uSCu0W2eK6J3E1TPeoHK7iJBl0qy8Wsu', 'employee17@example.invalid', 17, '営業部'),
('森 彩', '$2y$10$RakurakkuTestSalt0018uCZo3wAuuHs2KdPGBergUfy1I4IroOa.', 'employee18@example.invalid', 18, '営業部'),
('池田 浩', '$2y$10$RakurakkuTestSalt0019uFoQzjC4BdgXJGhYz.8UaZnpjDljLDdW', 'employee19@example.invalid', 19, '営業部'),
('橋本 玲子', '$2y$10$RakurakkuTestSalt0020ugS5Ngliq0qhy4wdLU0p4DAd0OWiWt2O', 'employee20@example.invalid', 20, '営業部');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
