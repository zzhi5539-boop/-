-- Supabase Schema for Intelligent Agricultural Logistics Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('管理员', '调度员', '司机')),
  status TEXT NOT NULL CHECK (status IN ('活跃', '离线', '已暂停')),
  access_level INTEGER NOT NULL DEFAULT 30,
  initials TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- Using TEXT for human-readable IDs like #ORD-7392
  date TEXT NOT NULL, -- Storing as string or could use timestamp
  product TEXT NOT NULL,
  product_detail TEXT NOT NULL,
  product_image TEXT NOT NULL,
  origin TEXT NOT NULL,
  origin_detail TEXT NOT NULL,
  destination TEXT NOT NULL,
  destination_detail TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('运输中', '待处理', '已完成', '延误')),
  driver TEXT,
  driver_image TEXT,
  temperature TEXT NOT NULL,
  cold_chain BOOLEAN NOT NULL DEFAULT false,
  crop_type TEXT, -- Added for crop category
  priority TEXT DEFAULT '普通' CHECK (priority IN ('普通', '高', '极高')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: system_settings (key-value store for app configuration)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (For this POC, we can allow anon access or authenticated access depending on setup. Allowing true for now to simplify frontend integration)
DROP POLICY IF EXISTS "Allow anonymous read access on users" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous insert access on users" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous update access on users" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous delete access on users" ON public.users;
CREATE POLICY "Allow anonymous read access on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access on users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access on users" ON public.users FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anonymous read access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous insert access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous update access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous delete access on orders" ON public.orders;
CREATE POLICY "Allow anonymous read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access on orders" ON public.orders FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anonymous access on settings" ON public.system_settings;
CREATE POLICY "Allow anonymous access on settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO public.system_settings (key, value) VALUES
('system_name', '农业物流智能管理系统'),
('notification_email', 'admin@agrilogistics.com'),
('temperature_alert_min', '2'),
('temperature_alert_max', '25'),
('auto_dispatch', 'true'),
('language', 'zh-CN'),
('data_retention_days', '90')
ON CONFLICT (key) DO NOTHING;

-- Insert initial mockup data for users
INSERT INTO public.users (name, email, role, status, access_level, initials) VALUES
('Sarah Jenkins', 'sarah.j@agrilogistics.com', '管理员', '活跃', 100, 'SJ'),
('Mike Ross', 'mike.r@agrilogistics.com', '调度员', '活跃', 70, 'MR'),
('David Chen', 'david.c@agrilogistics.com', '司机', '离线', 30, 'DC'),
('Emily Blunt', 'emily.b@agrilogistics.com', '调度员', '已暂停', 0, 'EB')
ON CONFLICT (email) DO NOTHING;

-- Insert initial mockup data for orders
INSERT INTO public.orders (id, date, product, product_detail, product_image, origin, origin_detail, destination, destination_detail, status, driver, driver_image, temperature, cold_chain, crop_type, priority) VALUES
('#ORD-7392', '10月24日, 09:30 AM', '有机番茄', '500 kg • 箱装 A2', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhTx7CAh7YI72Cl0-TMXqH8-HjxZR6D5GuN5R6kMSkGDbK7v_X21OffXJOb-77rb3DZdtjsQ1QSRmZuireXSMj1ygmvHFEZSzwedcDNAg_eDbZYWdN5uumqZ5Z5AVM_8_u_Ofou63wlL3z-1ifW95pBkkxSW2Ozjf82i_BbyK8Sjcpz5GZrpmTtDrOrqkcku38jWD31BGF_txlnKId-a742EjgZ-G583myun6ZCP4yRtGZyHfqv_anHldHeD8bqHYAoqKX3CfhlQ', '绿谷农场', '加州萨利纳斯', '全食配送中心', '加州圣何塞', '运输中', '迈克尔·R', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtnuhZTW4gSQuN0xXG38gkNUNiI1hBApdOTPNUrR9X4Bai7Ht6Ajbhxknzndjb14OHVAJ47hDa9k9nn74uqpC5cXlUfEftfkLQ_qS3vVTZ7cMWLf_4LBsr73UwlTDARYTPE7hF81k9h1Uq1-ekmENhBruN4FkYIG6Gp6Tzvj2jW86509Jfd-apv9U1oJ1Ytrm2J17SktBipq-MPPNdUCb1ryeVaUCbjbM6Vqdc03mF4dq2UZgThTY009OyeIHj-GMXLdWW_nPRPQ', '12°C', true, '蔬果', '普通'),
('#ORD-7391', '10月24日, 08:15 AM', '特级芒果', '200 kg • 箱装 B4', 'https://lh3.googleusercontent.com/aida-public/AB6AXuACf29IP_Y7Sg7X2fZZ8dnNUr5wl667zWuT6j1FM-jV82qminMCh5r84ETkTzxGa6dKRV1KSF-ixgCdSadXXeC0pPVUUVqtZ-TzN5ASCPV-Kx-lE3f_CnDiaYt4SzI_-y6jYAlpygcMrnGVTzfqEDySoDeflE5gsoxkMsJG7NbvL3rn47taepS-0O13xo9379LBlYPxOWSfyAe9bXgjkvv0Ln32h4fBD_GlbASueH3IlZamHC2OBd2vA8Cz521HswNIIkobSWaxbw', '阳光果园', '加州弗雷斯诺', '中央市场', '加州萨克拉门托', '待处理', null, null, '14°C', false, '蔬果', '高'),
('#ORD-7390', '10月23日, 04:45 PM', '甜玉米', '1200 kg • 散装', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxXMRYTxJMsEFnd3wQ31KwQcuAyp2LRDb8hCwCYT2Lw_xgg4yXrv4ipv1TIxr9Cl6yxa8Lnju4OeVHpuHtg9-DJMQ5Tgtd4qj9Cs_NP8bCmVYbSlIQsnuS_VPLmNhyXsW11zp3L1khPvCEnTLEuyox2ok08btokwf7f7sO6wDIzLM_L9Gt7122TFJyqwL0kJQdkrCEac2CmvIZWwAlyTzlDU1V4SstgBzRQtvN9Q6_j12ZHCwytKlPYAMIAui53GpCbazGwP9jZg', '中西部农业公司', '爱荷华州得梅因', '加工厂 A', '伊利诺伊州芝加哥', '已完成', '大卫·K', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfou9vd2kbjQqDZhCsTLk_RbyiS-H_O8w8WFHFnzQwdrrBSDzSEc7rbZQappgsvykFplAUBFzu31qPMv7wx7uNH9HXbAQY9rN6eU-tGiX0LarF82xRNGyJJRp8d-Fkn42ni1U8F3jzqamXST2PJ3jIhtDEXC86c5H4OGkpWxuWr9UZg6pK7LtM3GZpVuu8-9Kt89s0n29fOYdpGXdeJ6BocM6hzRw2gEZcaTxhZ8rq-hBtGBmgB8l9OAg', '4°C', true, '粮食', '普通'),
('#ORD-7389', '10月23日, 02:20 PM', '牛油果', '350 kg • 箱装 C1', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKlkgLOsDUzCwponSUhnByQDAsokIAD7cRZ47wF8UOuibuyS06Fp7bABSJCZsvha6pDP-JCUzVwlKQWynkbhS6XBX3kmLbi_xSbEKfmMwrHh7w6L75LZNve1dDGp_WRxCxPjYs2LXie3w4khO6o2r4_fG3zwTkJPJcHZAmxCxQn7jUB8ro5KTGD6zUgx8hwRCgMfLnUVLdpHVHzxFFXomtWbh91z4mfxhkYfVkGJP55I_KYMJAOt4OT5r48JgChaYrILur2LNtaQ', '沿海种植者', '加州奥克斯纳德', '克罗格配送中心', '加州康普顿', '延误', '莎拉·M', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSpyuRCbsBnFR3A894rRXhWRJLypwZ9KqMuLQjm7kod8UUDdIj3ZaIxS6dTN82OP1rAw4f6t6yNzWZhakAbSuq6NpEnukDtWE7hgSYBoMGZmgpWqL8xt7QuK-khK9cqQ6CEjw3IXtIRpPKKs5Fv2sdCnci0SHVJE94pXj8epRYim7c3uGXAA8C949_hDLZDYSIuK4olWc5H1Eh7AQBP94tjwhO-GRC4YQZwmt67zw3_kGaAhbhwudihtz3-1drQNECYdB9iPGjEQ', '7°C', true, '蔬果', '极高'),
('#ORD-8001', '10月24日, 11:00 AM', '新鲜蓝莓', '800 盒 • 冷藏散货', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhTx7CAh7YI72Cl0-TMXqH8-HjxZR6D5GuN5R6kMSkGDbK7v_X21OffXJOb-77rb3DZdtjsQ1QSRmZuireXSMj1ygmvHFEZSzwedcDNAg_eDbZYWdN5uumqZ5Z5AVM_8_u_Ofou63wlL3z-1ifW95pBkkxSW2Ozjf82i_BbyK8Sjcpz5GZrpmTtDrOrqkcku38jWD31BGF_txlnKId-a742EjgZ-G583myun6ZCP4yRtGZyHfqv_anHldHeD8bqHYAoqKX3CfhlQ', '高山浆果园', '俄勒冈州波特兰', '西雅图农贸分拨站', '华盛顿州西雅图', '运输中', '约翰·D', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtnuhZTW4gSQuN0xXG38gkNUNiI1hBApdOTPNUrR9X4Bai7Ht6Ajbhxknzndjb14OHVAJ47hDa9k9nn74uqpC5cXlUfEftfkLQ_qS3vVTZ7cMWLf_4LBsr73UwlTDARYTPE7hF81k9h1Uq1-ekmENhBruN4FkYIG6Gp6Tzvj2jW86509Jfd-apv9U1oJ1Ytrm2J17SktBipq-MPPNdUCb1ryeVaUCbjbM6Vqdc03mF4dq2UZgThTY009OyeIHj-GMXLdWW_nPRPQ', '2°C', true, '蔬果', '高'),
('#ORD-8002', '10月24日, 14:30 PM', '有机走地鸡', '150 笼 • 活体运输', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhTx7CAh7YI72Cl0-TMXqH8-HjxZR6D5GuN5R6kMSkGDbK7v_X21OffXJOb-77rb3DZdtjsQ1QSRmZuireXSMj1ygmvHFEZSzwedcDNAg_eDbZYWdN5uumqZ5Z5AVM_8_u_Ofou63wlL3z-1ifW95pBkkxSW2Ozjf82i_BbyK8Sjcpz5GZrpmTtDrOrqkcku38jWD31BGF_txlnKId-a742EjgZ-G583myun6ZCP4yRtGZyHfqv_anHldHeD8bqHYAoqKX3CfhlQ', '晨光养殖场', '得克萨斯州奥斯汀', '州立屠宰加工厂', '得克萨斯州达拉斯', '运输中', '艾米丽·W', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSpyuRCbsBnFR3A894rRXhWRJLypwZ9KqMuLQjm7kod8UUDdIj3ZaIxS6dTN82OP1rAw4f6t6yNzWZhakAbSuq6NpEnukDtWE7hgSYBoMGZmgpWqL8xt7QuK-khK9cqQ6CEjw3IXtIRpPKKs5Fv2sdCnci0SHVJE94pXj8epRYim7c3uGXAA8C949_hDLZDYSIuK4olWc5H1Eh7AQBP94tjwhO-GRC4YQZwmt67zw3_kGaAhbhwudihtz3-1drQNECYdB9iPGjEQ', '常温', false, '畜牧', '普通')
ON CONFLICT (id) DO NOTHING;

-- Force update temperatures from ranges to fixed values for existing data
UPDATE public.orders SET temperature = '12°C' WHERE id = '#ORD-7392';
UPDATE public.orders SET temperature = '14°C' WHERE id = '#ORD-7391';
UPDATE public.orders SET temperature = '4°C' WHERE id = '#ORD-7390';
UPDATE public.orders SET temperature = '7°C' WHERE id = '#ORD-7389';

-- Table: order_tracking (Real-time vehicle status)
CREATE TABLE IF NOT EXISTS public.order_tracking (
  order_id TEXT PRIMARY KEY REFERENCES public.orders(id) ON DELETE CASCADE,
  current_speed DECIMAL NOT NULL DEFAULT 0,
  congestion_level TEXT NOT NULL DEFAULT '畅通',
  eta_timestamp TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Schema Migration: Add new sensor columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_tracking' AND column_name='current_temperature') THEN
        ALTER TABLE public.order_tracking ADD COLUMN current_temperature DECIMAL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_tracking' AND column_name='humidity') THEN
        ALTER TABLE public.order_tracking ADD COLUMN humidity DECIMAL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='order_tracking' AND column_name='fuel_level') THEN
        ALTER TABLE public.order_tracking ADD COLUMN fuel_level DECIMAL;
    END IF;
END $$;

-- Enable RLS for order_tracking
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for order_tracking
DROP POLICY IF EXISTS "Allow anonymous read access on order_tracking" ON public.order_tracking;
DROP POLICY IF EXISTS "Allow anonymous insert access on order_tracking" ON public.order_tracking;
DROP POLICY IF EXISTS "Allow anonymous update access on order_tracking" ON public.order_tracking;
CREATE POLICY "Allow anonymous read access on order_tracking" ON public.order_tracking FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on order_tracking" ON public.order_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access on order_tracking" ON public.order_tracking FOR UPDATE USING (true);

-- Insert initial mockup data for order_tracking
INSERT INTO public.order_tracking (order_id, current_speed, current_temperature, humidity, fuel_level, congestion_level, eta_timestamp) VALUES
('#ORD-7392', 65.5, 12.5, 82.0, 75.0, '畅通', timezone('utc'::text, now() + interval '2 hours')),
('#ORD-7391', 0.0, 14.8, 78.5, 92.0, '畅通', null),
('#ORD-7390', 0.0, 4.5, 85.0, 15.0, '畅通', null),
('#ORD-7389', 15.2, 8.2, 88.0, 34.0, '严重拥堵', timezone('utc'::text, now() + interval '4 hours 30 minutes')),
('#ORD-8001', 82.5, 2.5, 75.0, 68.0, '轻微拥堵', timezone('utc'::text, now() + interval '8 hours 10 minutes')),
('#ORD-8002', 76.0, 24.0, 50.0, 45.0, '畅通', timezone('utc'::text, now() + interval '12 hours 45 minutes'))
ON CONFLICT (order_id) DO UPDATE SET 
    current_speed = EXCLUDED.current_speed,
    current_temperature = EXCLUDED.current_temperature,
    humidity = EXCLUDED.humidity,
    fuel_level = EXCLUDED.fuel_level,
    congestion_level = EXCLUDED.congestion_level,
    eta_timestamp = EXCLUDED.eta_timestamp;
