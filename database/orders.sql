-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:3306
-- 生成日時: 2026-10-27 12:42:40
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
-- テーブルの構造 `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `summary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_date` date NOT NULL,
  `production` tinyint(1) NOT NULL,
  `small_item` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `double_check` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `small_double_check` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

--
-- テーブルのデータのダンプ `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `employee_id`, `summary`, `due_date`, `production`, `small_item`, `double_check`, `small_double_check`, `drawing`, `drawing_detail`, `post_l`, `post_l_detail`, `post_t`, `post_t_detail`, `base`, `base_detail`, `arm`, `arm_detail`, `angle`, `angle_detail`, `a_base`, `a_base_detail`, `other_1`, `other_1_detail`, `other_2`, `other_2_detail`, `other_3`, `other_3_detail`, `other_4`, `other_4_detail`, `other_5`, `other_5_detail`, `brace`, `brace_detail`) VALUES
(1, 1, 1, 'H145', '2026-10-31', 1, NULL, '佐藤 花子', NULL, 2, 'RK-101 中量ラック4段 / 図番DR-101 / W900×D450×H1800mm', 2, '支柱: 鋼板 t2.3 / 50×50×1800mm / 12本', 2, '横桟: 角形鋼管 40×20×t1.6 / 12本', 2, 'ベースプレート: SS400 t6.0 / 4個', 0, NULL, 0, NULL, 0, NULL, 2, '棚板: SS400 t1.6 / 12枚', 2, '背面ブレース: FB 32×3.2 / 6本', 0, NULL, 0, NULL, 0, NULL, 2, '横揺れ防止補強材: FB 32×3.2 / 6本'),
(2, 2, 2, 'H180', '2026-11-04', 1, NULL, NULL, '佐藤 花子', 1, 'RK-102 軽量棚5段 / 図番DR-102 / W1200×D400×H1800mm', 2, '支柱: スチール t1.6 / 40×40×1800mm / 20本', 1, '横桟: スチール t1.6 / 20本', 1, '脚部ベース: スチール t2.3 / 4個', 0, NULL, 0, NULL, 0, NULL, 1, '棚板: スチール t1.2 / 20枚', 1, '背面補強材: スチール t1.6 / 10本', 0, NULL, 0, NULL, 0, NULL, 1, '転倒防止ブレース: スチール / 10本'),
(3, 3, 3, 'H110', '2026-11-05', 1, NULL, '鈴木 一郎', NULL, 3, 'RK-103 重量ラック3段 / 図番DR-103 / W1500×D600×H2100mm', 3, '支柱: 高張力鋼板 t3.2 / 75×75×2100mm / 8本', 0, '横桟: 角形鋼管 60×40×t2.3 / 8本', 0, 'ベースプレート: SS400 t9.0 / 4個', 0, NULL, 0, NULL, 0, NULL, 0, '棚板: SS400 t2.3 / 8枚', 0, '補強材: FB 50×6.0 / 4本', 0, NULL, 0, NULL, 0, NULL, 0, '横揺れ防止材: FB 50×6.0 / 4本'),
(4, 4, 4, 'H200', '2026-11-07', 1, NULL, '高橋 美咲', '伊藤 健太', 2, 'RK-104 工具保管ラック / 図番DR-104 / W900×D600×H1500mm', 2, '支柱: スチール t2.3 / 50×50×1500mm / 16本', 2, '工具掛け横桟: 角形鋼管 40×20×t1.6 / 8本', 2, 'ベースプレート: SS400 t6.0 / 4個', 1, '工具掛けアーム: 丸棒 φ12 / 16本', 1, '補強アングル: L40×40×t3.2 / 8本', 0, NULL, 2, '工具棚板: スチール t1.6 / 16枚', 2, '背面パネル: スチール t1.2 / 4枚', 0, NULL, 0, NULL, 0, NULL, 2, '転倒防止材: FB 32×3.2 / 4本'),
(5, 5, 5, 'H125', '2026-11-10', 0, NULL, NULL, '小林 誠', 0, 'RK-105 部品棚6段 / 図番DR-105 / W750×D350×H1800mm', 0, '支柱: スチール t1.6 / 40×40×1800mm / 32本', 0, NULL, 0, '脚部ベース: スチール t2.3 / 4個', 0, NULL, 0, '棚受けアングル: L30×30×t2.3 / 32本', 0, NULL, 0, '部品棚板: スチール t1.2 / 32枚', 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
