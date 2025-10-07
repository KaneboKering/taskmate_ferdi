USE taskmate_db;

-- Seed kategori
INSERT IGNORE INTO categories (`key`, color) VALUES
('Umum', '#334155'),
('Mobile', '#2563eb'),
('RPL', '#16a34a'),
('IoT', '#f59e0b');

-- Seed tugas
INSERT IGNORE INTO tasks (id, title, description, deadline, category, priority, status, progress)
VALUES
('11111111-1111-1111-1111-111111111111', 'Tugas Mobile: SectionList + Grouping', 'Implementasi SectionList per kategori dan reminder deadline.', '2025-10-05', 'Mobile', 'High', 'pending', 30),
('22222222-2222-2222-2222-222222222222', 'Refactor Storage: Migrasi ke Server', 'Ganti AsyncStorage ke REST API untuk tasks & categories.', '2025-10-01', 'RPL', 'Medium', 'pending', 50),
('33333333-3333-3333-3333-333333333333', 'Tambah Kategori Dinamis', 'Tambahkan kategori baru via modal dan simpan ke server.', '2025-10-12', 'Umum', 'Low', 'pending', 10);