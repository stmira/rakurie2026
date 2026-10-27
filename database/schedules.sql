-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:3306
-- 生成日時: 2026-10-27 12:41:26
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

--
-- テーブルのデータのダンプ `schedules`
--

INSERT INTO `schedules` (`schedule_id`, `employee_id`, `order_id`, `task_id`, `detail`, `status`, `quantity`, `actual_start_date`, `actual_end_date`, `planned_start_date`, `planned_end_date`) VALUES
(1, 1, 1, 9, '塗装作業', '完了', 3, '2026-10-26', '2026-10-27', '2026-10-26', '2026-10-27'),
(2, 2, 2, 3, 'ドリルソー加工', '作業中', 5, '2026-10-27', NULL, '2026-10-27', '2026-10-28'),
(3, 3, 3, 2, '図面確認', '遅延', 2, '2026-10-27', NULL, '2026-10-22', '2026-10-23'),
(4, 4, 4, 7, 'ポスト溶接', '完了', 4, '2026-10-26', '2026-10-27', '2026-10-23', '2026-10-26'),
(5, 5, NULL, 14, '工程進捗会議', '未着手', NULL, NULL, NULL, '2026-10-30', '2026-10-30');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `task_id` (`task_id`);

--
-- ダンプしたテーブルの制約
--

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
