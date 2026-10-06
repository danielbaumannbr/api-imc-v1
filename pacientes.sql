-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 06/10/2026 às 19:39
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `consultorio_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `idade` int(11) NOT NULL,
  `altura` decimal(4,2) NOT NULL,
  `peso` decimal(5,2) NOT NULL,
  `imc` decimal(4,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pacientes`
--

INSERT INTO `pacientes` (`id`, `nome`, `idade`, `altura`, `peso`, `imc`, `status`, `criado_em`) VALUES
(1, 'Ana Silva', 22, 1.65, 45.00, 16.53, 'Abaixo do peso normal', '2026-10-05 17:07:26'),
(2, 'Carlos Eduardo', 30, 1.75, 52.00, 16.98, 'Abaixo do peso normal', '2026-10-05 17:07:26'),
(3, 'Maria Baumann', 29, 1.70, 65.00, 22.49, 'Peso normal', '2026-10-05 17:07:26'),
(5, 'Juliana Costa', 35, 1.68, 65.00, 23.03, 'Peso normal', '2026-10-05 17:07:26'),
(6, 'Roberto Alves', 50, 1.70, 78.00, 26.99, 'Excesso de Peso', '2026-10-05 17:07:26'),
(7, 'Beatriz Lima', 29, 1.62, 73.00, 27.82, 'Excesso de Peso', '2026-10-05 17:07:26'),
(8, 'Lucas Martins', 40, 1.78, 90.00, 28.40, 'Excesso de Peso', '2026-10-05 17:07:26'),
(9, 'Fernanda Souza', 38, 1.55, 80.00, 33.30, 'Obesidade', '2026-10-05 17:07:26'),
(10, 'Gabriel Oliveira', 52, 1.72, 105.00, 35.49, 'Obesidade', '2026-10-05 17:07:26'),
(13, 'Josmar', 67, 1.67, 67.00, 24.02, 'Peso normal', '2026-10-05 19:41:06');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
