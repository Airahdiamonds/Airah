CREATE TYPE "public"."status" AS ENUM('pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('ring', 'necklace', 'pendant', 'bracelet');--> statement-breakpoint
CREATE TYPE "public"."product_sub_category" AS ENUM('Stackable Rings', 'Birthstone Rings', 'Eternity Rings', 'Fashion Rings', 'Stud Earrings', 'Hoop Earrings', 'Drop Earrings', 'Chandelier Earrings', 'Bangle Bracelets', 'Tennis Bracelets', 'Cuff Bracelets', 'Charm Bracelets', 'Pendant Necklaces', 'Choker Necklaces', 'Lariat Necklaces', 'Statement Necklaces');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('creditCard', 'upi');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."clarity" AS ENUM('SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF');--> statement-breakpoint
CREATE TYPE "public"."color" AS ENUM('D', 'E', 'F', 'G', 'H');--> statement-breakpoint
CREATE TYPE "public"."cut" AS ENUM('regular', 'best', 'premium');--> statement-breakpoint
CREATE TYPE "public"."shape" AS ENUM('round', 'princess', 'emerald', 'asscher', 'oval', 'pear', 'marquise', 'radiant', 'cushion', 'heart');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4');--> statement-breakpoint
CREATE TYPE "public"."head_style" AS ENUM('Four Prong', 'Six Prong', 'Classic Basket', 'Pave Basket', 'Surprise Diamond', 'Surprise Sapphire', 'Lotus Basket', 'Tulip Basket', 'Scalloped Six Prong', 'Vintage Basket', 'Pave Halo', 'Sapphire Halo', 'French Pave Halo', 'Falling Edge Halo');--> statement-breakpoint
CREATE TYPE "public"."metal" AS ENUM('14K White Gold', '14K Yellow Gold', '14K Rose Gold', '18K White Gold', '18K Yellow Gold', '18K Rose Gold', 'Platinum');--> statement-breakpoint
CREATE TYPE "public"."shank_style" AS ENUM('Solitaire', 'French Pave', 'U Shaped Pave', 'Knife Edge Pave', 'Knife Edge Solitaire', 'Marquise Diamond', 'Marquise Saphire', 'Cathedral Pave', 'Rope Solitaire', 'Rope Pave', 'Sleek Accent', 'Channel Set');--> statement-breakpoint
CREATE TYPE "public"."oauth_provides" AS ENUM('google', 'facebook');--> statement-breakpoint
CREATE TABLE "cart" (
	"cart_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer DEFAULT null,
	"guest_id" varchar(36) DEFAULT null,
	"product_id" integer DEFAULT null,
	"diamond_id" integer DEFAULT null,
	"ring_style_id" integer DEFAULT null,
	"quantity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"coupon_id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discount_percentage" integer NOT NULL,
	"expiry_date" date NOT NULL,
	"max_uses" integer DEFAULT 1,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"favourite_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"product_id" integer DEFAULT null,
	"diamond_id" integer DEFAULT null,
	"ring_style_id" integer DEFAULT null,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_item_id" serial PRIMARY KEY NOT NULL,
	"order_id" serial NOT NULL,
	"product_id" integer DEFAULT null,
	"diamond_id" integer DEFAULT null,
	"ring_style_id" integer DEFAULT null,
	"product_cost" numeric,
	"diamond_cost" numeric,
	"ring_cost" numeric,
	"quantity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer DEFAULT null,
	"guest_id" varchar(36) DEFAULT null,
	"total_amount" integer NOT NULL,
	"status" "status" DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"SKU" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"segment" text,
	"name" text NOT NULL,
	"category" "product_category" DEFAULT 'ring',
	"description" text NOT NULL,
	"subCategory" "product_sub_category" DEFAULT 'Stackable Rings',
	"product_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_URL" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gold_quantity" numeric,
	"gold_price" numeric,
	"gold_total" numeric,
	"round_quantity" numeric,
	"round_price" numeric,
	"round_total" numeric,
	"oval_quantity" numeric,
	"oval_price" numeric,
	"oval_total" numeric,
	"marquise_quantity" numeric,
	"marquise_price" numeric,
	"marquise_total" numeric,
	"emerald_quantity" numeric,
	"emerald_price" numeric,
	"emerald_total" numeric,
	"princess_quantity" numeric,
	"princess_price" numeric,
	"princess_total" numeric,
	"pear_quantity" numeric,
	"pear_price" numeric,
	"pear_total" numeric,
	"heart_quantity" numeric,
	"heart_price" numeric,
	"heart_total" numeric,
	"other_diamond_quantity" numeric,
	"other_diamond_price" numeric,
	"other_diamond_total" numeric,
	"gemstone_quantity" numeric,
	"gemstone_price" numeric,
	"gemstone_total" numeric,
	"misc_cost" numeric,
	"labour_cost" numeric,
	"other_cost" numeric,
	"total_cost" numeric
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"product_id" integer DEFAULT null,
	"diamond_id" integer DEFAULT null,
	"ring_style_id" integer DEFAULT null,
	"rating" integer NOT NULL,
	"image_URL" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"order_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending',
	"payment_date" timestamp with time zone DEFAULT now() NOT NULL,
	"transaction_amount" integer NOT NULL,
	"transaction_reference" text,
	"refunded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"password" text,
	"salt" text,
	"name" text NOT NULL,
	"role" "role" DEFAULT 'user',
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "master" (
	"master_id" serial PRIMARY KEY NOT NULL,
	"GBP_rate" numeric,
	"USD_rate" numeric,
	"AUD_rate" numeric,
	"AED_rate" numeric,
	"OMR_rate" numeric,
	"EUR_rate" numeric,
	"gold_rate" numeric,
	"diamond_rate" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diamonds" (
	"diamond_id" serial PRIMARY KEY NOT NULL,
	"SKU" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"size" "size" DEFAULT '0.5',
	"image_URL" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"shape" "shape" DEFAULT 'round',
	"cut" "cut" DEFAULT 'regular',
	"color" "color" DEFAULT 'D',
	"clarity" "clarity" DEFAULT 'IF',
	"price" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ringStyles" (
	"ring_style_id" serial PRIMARY KEY NOT NULL,
	"SKU" text,
	"name" text NOT NULL,
	"image_URL" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text NOT NULL,
	"head_style" "head_style" DEFAULT 'Four Prong',
	"head_style_price" numeric,
	"head_metal" "metal" DEFAULT '14K White Gold',
	"head_metal_price" numeric,
	"shank_style" "shank_style" DEFAULT 'Solitaire',
	"shank_style_price" numeric,
	"shank_metal" "metal" DEFAULT '14K White Gold',
	"shank_metal_price" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_oauth_accounts" (
	"user_id" serial NOT NULL,
	"provider" "oauth_provides" NOT NULL,
	"providerAccountId" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_oauth_accounts_providerAccountId_provider_pk" PRIMARY KEY("providerAccountId","provider"),
	CONSTRAINT "user_oauth_accounts_providerAccountId_unique" UNIQUE("providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"address_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer DEFAULT null,
	"guest_id" varchar(36) DEFAULT null,
	"order_id" integer DEFAULT null,
	"full_name" text NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"address_line1" text NOT NULL,
	"address_line2" text DEFAULT '',
	"city" text NOT NULL,
	"state" text NOT NULL,
	"country" text NOT NULL,
	"pincode" varchar(10) NOT NULL,
	"is_billing" boolean DEFAULT false,
	"is_shipping" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_diamond_id_diamonds_diamond_id_fk" FOREIGN KEY ("diamond_id") REFERENCES "public"."diamonds"("diamond_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_ring_style_id_ringStyles_ring_style_id_fk" FOREIGN KEY ("ring_style_id") REFERENCES "public"."ringStyles"("ring_style_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_diamond_id_diamonds_diamond_id_fk" FOREIGN KEY ("diamond_id") REFERENCES "public"."diamonds"("diamond_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_ring_style_id_ringStyles_ring_style_id_fk" FOREIGN KEY ("ring_style_id") REFERENCES "public"."ringStyles"("ring_style_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_diamond_id_diamonds_diamond_id_fk" FOREIGN KEY ("diamond_id") REFERENCES "public"."diamonds"("diamond_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ring_style_id_ringStyles_ring_style_id_fk" FOREIGN KEY ("ring_style_id") REFERENCES "public"."ringStyles"("ring_style_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_diamond_id_diamonds_diamond_id_fk" FOREIGN KEY ("diamond_id") REFERENCES "public"."diamonds"("diamond_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_ring_style_id_ringStyles_ring_style_id_fk" FOREIGN KEY ("ring_style_id") REFERENCES "public"."ringStyles"("ring_style_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;