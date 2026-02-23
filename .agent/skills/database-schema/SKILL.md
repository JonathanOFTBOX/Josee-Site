---
name: Database Schema Reference
description: Complete Supabase database schema for Asset-Manager. ALWAYS check this before writing SQL or referencing DB columns.
---

# Database Schema Reference

**ALWAYS** check this file before writing SQL queries or referencing database column names. Do NOT guess column names.

## Key Relationships
- `sessions.user_id` → `profiles.id` (worker)
- `sessions.job_id` → `jobs.id`
- `sessions.allocation_id` → `job_allocations.id`
- `job_materials.job_id` → `jobs.id`
- `job_materials.item_id` → `inventory_items.id`
- `job_materials.session_id` → `sessions.id`
- `truck_inventory.truck_id` → `trucks.id`
- `truck_inventory.inventory_item_id` → `inventory_items.id`
- `trucks.current_worker_id` → `profiles.id`
- `jobs.assigned_truck_id` → `trucks.id`

## bug_reports

| column_name       | data_type                | is_nullable |
| ----------------- | ------------------------ | ----------- |
| id                | uuid                     | NO          |
| company_id        | uuid                     | YES         |
| user_id           | text                     | YES         |
| user_name         | text                     | YES         |
| user_email        | text                     | YES         |
| company_name      | text                     | YES         |
| message           | text                     | NO          |
| app_version       | text                     | YES         |
| user_agent        | text                     | YES         |
| screenshot_urls   | ARRAY                    | YES         |
| status            | text                     | YES         |
| admin_notes       | text                     | YES         |
| created_at        | timestamp with time zone | YES         |
| resolved_at       | timestamp with time zone | YES         |

## checkins

| column_name        | data_type                | is_nullable |
| ------------------ | ------------------------ | ----------- |
| id                 | uuid                     | NO          |
| session_id         | uuid                     | NO          |
| job_id             | uuid                     | NO          |
| user_id            | uuid                     | NO          |
| company_id         | uuid                     | NO          |
| on_track           | boolean                  | NO          |
| comment            | text                     | YES         |
| needs_call         | boolean                  | YES         |
| admin_acknowledged | boolean                  | YES         |
| created_at         | timestamp with time zone | YES         |

## clients

| column_name               | data_type                | is_nullable |
| ------------------------- | ------------------------ | ----------- |
| id                        | uuid                     | NO          |
| company_id                | uuid                     | YES         |
| name                      | text                     | NO          |
| address                   | text                     | NO          |
| unit_number               | text                     | YES         |
| latitude                  | real                     | NO          |
| longitude                 | real                     | NO          |
| contact_name              | text                     | YES         |
| contact_phone             | text                     | YES         |
| contact_email             | text                     | YES         |
| created_at                | timestamp with time zone | YES         |
| labor_discount_percent    | real                     | YES         |
| material_discount_percent | real                     | YES         |
| default_hourly_rate       | real                     | YES         |
| invoice_preferences       | text                     | YES         |
| is_internal               | boolean                  | YES         |

## companies

| column_name            | data_type                | is_nullable |
| ---------------------- | ------------------------ | ----------- |
| id                     | uuid                     | NO          |
| name                   | text                     | NO          |
| created_at             | timestamp with time zone | NO          |
| trial_started_at       | timestamp with time zone | YES         |
| trial_ends_at          | timestamp with time zone | YES         |
| plan_status            | text                     | NO          |
| address                | text                     | YES         |
| phone                  | text                     | YES         |
| email                  | text                     | YES         |
| logo_url               | text                     | YES         |
| invoice_prefix         | text                     | YES         |
| stripe_customer_id     | text                     | YES         |
| stripe_subscription_id | text                     | YES         |
| subscription_seats     | integer                  | YES         |
| qr_tracking_required   | boolean                  | YES         |
| tax_country            | text                     | YES         |
| tax_province           | text                     | YES         |
| order_copy_email_1     | text                     | YES         |
| order_copy_email_2     | text                     | YES         |
| price_per_employee     | real                     | YES         |
| invoice_start_number   | text                     | YES         |
| quote_prefix           | text                     | YES         |
| quote_start_number     | text                     | YES         |
| tps_number             | text                     | YES         |
| tvq_number             | text                     | YES         |
| rbq_license            | text                     | YES         |

## company_invites

| column_name | data_type                | is_nullable |
| ----------- | ------------------------ | ----------- |
| id          | uuid                     | NO          |
| email       | text                     | NO          |
| company_id  | uuid                     | NO          |
| role        | text                     | NO          |
| full_name   | text                     | YES         |
| invited_by  | uuid                     | YES         |
| status      | text                     | NO          |
| created_at  | timestamp with time zone | NO          |

## expenses

| column_name | data_type                | is_nullable |
| ----------- | ------------------------ | ----------- |
| id          | uuid                     | NO          |
| job_id      | uuid                     | NO          |
| description | text                     | NO          |
| amount      | numeric                  | NO          |
| date        | timestamp with time zone | NO          |
| created_at  | timestamp with time zone | NO          |
| user_id     | uuid                     | YES         |
| recorded_by | uuid                     | YES         |
| image_url   | text                     | YES         |

## geocoding_logs

| column_name       | data_type                | is_nullable |
| ----------------- | ------------------------ | ----------- |
| id                | uuid                     | NO          |
| company_id        | uuid                     | NO          |
| address           | text                     | NO          |
| confidence        | real                     | NO          |
| latitude          | real                     | YES         |
| longitude         | real                     | YES         |
| provider_response | text                     | YES         |
| created_at        | timestamp with time zone | YES         |

## inventory_history

| column_name       | data_type                | is_nullable |
| ----------------- | ------------------------ | ----------- |
| id                | uuid                     | NO          |
| company_id        | uuid                     | NO          |
| inventory_item_id | uuid                     | YES         |
| quantity          | integer                  | NO          |
| action_type       | text                     | NO          |
| job_id            | uuid                     | YES         |
| session_id        | uuid                     | YES         |
| truck_id          | uuid                     | YES         |
| user_id           | uuid                     | NO          |
| notes             | text                     | YES         |
| created_at        | timestamp with time zone | YES         |

## inventory_items

| column_name       | data_type                   | is_nullable |
| ----------------- | --------------------------- | ----------- |
| id                | uuid                        | NO          |
| company_id        | uuid                        | NO          |
| name              | text                        | NO          |
| sku               | text                        | YES         |
| description       | text                        | YES         |
| quantity          | real                        | NO          |
| unit              | text                        | YES         |
| unit_cost         | real                        | NO          |
| created_at        | timestamp without time zone | YES         |
| retail_price      | real                        | YES         |
| supplier          | text                        | YES         |
| manufacturer_code | text                        | YES         |
| min_stock_level   | real                        | YES         |
| location          | text                        | YES         |
| is_archived       | boolean                     | YES         |
| image_url         | text                        | YES         |
| units_per_package | integer                     | YES         |
| updated_at        | timestamp with time zone    | YES         |
| deleted_at        | timestamp with time zone    | YES         |

## inventory_logs

| column_name       | data_type                | is_nullable |
| ----------------- | ------------------------ | ----------- |
| id                | uuid                     | NO          |
| company_id        | uuid                     | NO          |
| user_id           | uuid                     | NO          |
| product_id        | uuid                     | YES         |
| order_id          | uuid                     | YES         |
| action            | text                     | NO          |
| quantity_change   | real                     | YES         |
| previous_quantity | real                     | YES         |
| new_quantity      | real                     | YES         |
| notes             | text                     | YES         |
| created_at        | timestamp with time zone | YES         |

## inventory_units

| column_name            | data_type                | is_nullable |
| ---------------------- | ------------------------ | ----------- |
| id                     | uuid                     | NO          |
| product_id             | uuid                     | NO          |
| purchase_order_item_id | uuid                     | YES         |
| reception_log_id       | uuid                     | YES         |
| qr_code                | text                     | NO          |
| status                 | text                     | NO          |
| location_type          | text                     | YES         |
| location_id            | uuid                     | YES         |
| location_name          | text                     | YES         |
| notes                  | text                     | YES         |
| created_at             | timestamp with time zone | NO          |
| updated_at             | timestamp with time zone | NO          |
| initial_quantity       | real                     | YES         |
| remaining_quantity     | real                     | YES         |

## job_allocations

| column_name          | data_type                | is_nullable |
| -------------------- | ------------------------ | ----------- |
| id                   | uuid                     | NO          |
| company_id           | uuid                     | NO          |
| job_id               | uuid                     | NO          |
| scheduled_date       | date                     | NO          |
| scheduled_start_time | text                     | YES         |
| scheduled_end_time   | text                     | YES         |
| planned_hours        | real                     | NO          |
| assigned_workers     | ARRAY                    | YES         |
| status               | text                     | NO          |
| actual_hours         | real                     | YES         |
| overtime_hours       | real                     | YES         |
| validated_at         | timestamp with time zone | YES         |
| validated_by         | uuid                     | YES         |
| admin_notes          | text                     | YES         |
| day_number           | integer                  | YES         |
| is_spillover         | boolean                  | YES         |
| created_at           | timestamp with time zone | YES         |
| updated_at           | timestamp with time zone | YES         |

## job_materials

| column_name        | data_type                   | is_nullable |
| ------------------ | --------------------------- | ----------- |
| id                 | uuid                        | NO          |
| job_id             | uuid                        | NO          |
| item_id            | uuid                        | NO          |
| quantity_used      | real                        | NO          |
| cost_at_time       | real                        | NO          |
| created_at         | timestamp without time zone | YES         |
| confirmed          | boolean                     | YES         |
| confirmed_at       | timestamp with time zone    | YES         |
| confirmed_method   | text                        | YES         |
| planned_quantity   | real                        | YES         |
| removed            | boolean                     | YES         |
| approved_for_pickup| boolean                     | YES         |
| added_by_worker    | boolean                     | YES         |
| source_unit_id     | uuid                        | YES         |
| source_data        | text                        | YES         |
| session_id         | uuid                        | YES         |

## jobs

| column_name        | data_type                | is_nullable |
| ------------------ | ------------------------ | ----------- |
| id                 | uuid                     | NO          |
| company_id         | uuid                     | YES         |
| title              | text                     | NO          |
| description        | text                     | YES         |
| address            | text                     | NO          |
| latitude           | real                     | NO          |
| longitude          | real                     | NO          |
| status             | text                     | NO          |
| assigned_to        | uuid                     | YES         |
| assigned_workers   | ARRAY                    | YES         |
| required_workers   | integer                  | YES         |
| client_name        | text                     | YES         |
| scheduled_date     | text                     | YES         |
| estimated_hours    | real                     | YES         |
| created_at         | timestamp with time zone | YES         |
| is_urgent          | boolean                  | YES         |
| skip_weekends      | boolean                  | YES         |
| job_number         | integer                  | NO          |
| lifecycle_status   | text                     | YES         |
| admin_notes        | text                     | YES         |
| validated_at       | timestamp with time zone | YES         |
| validated_by       | uuid                     | YES         |
| assigned_truck_id  | uuid                     | YES         |
| payment_terms      | text                     | YES         |
| payment_due_date   | timestamp with time zone | YES         |
| client_rate        | real                     | YES         |
| billing_type       | text                     | YES         |
| invoiced_at        | timestamp with time zone | YES         |
| paid_at            | timestamp with time zone | YES         |
| discount_percent   | real                     | YES         |
| discount_amount    | real                     | YES         |
| job_type           | text                     | YES         |
| follow_up_date     | timestamp with time zone | YES         |
| follow_up_notes    | text                     | YES         |
| scheduled_time     | text                     | YES         |
| quote_number       | text                     | YES         |
| converted_from_quote | boolean                | YES         |

## messages

| column_name | data_type                | is_nullable |
| ----------- | ------------------------ | ----------- |
| id          | uuid                     | NO          |
| company_id  | uuid                     | YES         |
| sender_id   | text                     | NO          |
| receiver_id | text                     | YES         |
| channel_id  | text                     | YES         |
| content     | text                     | NO          |
| created_at  | timestamp with time zone | YES         |
| read_at     | timestamp with time zone | YES         |

## photos

| column_name | data_type                | is_nullable |
| ----------- | ------------------------ | ----------- |
| id          | uuid                     | NO          |
| company_id  | uuid                     | YES         |
| session_id  | uuid                     | NO          |
| url         | text                     | NO          |
| type        | text                     | NO          |
| captured_at | timestamp with time zone | NO          |
| latitude    | real                     | YES         |
| longitude   | real                     | YES         |
| created_at  | timestamp with time zone | YES         |
| notes       | text                     | YES         |

## product_suppliers

| column_name  | data_type                   | is_nullable |
| ------------ | --------------------------- | ----------- |
| id           | uuid                        | NO          |
| product_id   | uuid                        | NO          |
| supplier_id  | uuid                        | NO          |
| cost_price   | real                        | NO          |
| retail_price | real                        | NO          |
| supplier_sku | text                        | YES         |
| lead_time_days| integer                    | YES         |
| is_preferred | boolean                     | YES         |
| created_at   | timestamp without time zone | YES         |

## profiles

| column_name | data_type                | is_nullable |
| ----------- | ------------------------ | ----------- |
| id          | uuid                     | NO          |
| email       | text                     | NO          |
| role        | text                     | NO          |
| created_at  | timestamp with time zone | NO          |
| company_id  | uuid                     | YES         |
| full_name   | text                     | YES         |
| hourly_rate | numeric                  | YES         |
| cost_rate   | real                     | YES         |
| username    | text                     | YES         |
| avatar      | text                     | YES         |
| permissions | text                     | YES         |
| is_owner    | boolean                  | YES         |

## purchase_order_items

| column_name      | data_type                | is_nullable |
| ---------------- | ------------------------ | ----------- |
| id               | uuid                     | NO          |
| order_id         | uuid                     | NO          |
| product_id       | uuid                     | NO          |
| quantity_ordered | real                     | NO          |
| quantity_received| real                     | YES         |
| unit_cost        | real                     | NO          |
| created_at       | timestamp with time zone | YES         |
| received_at      | timestamp with time zone | YES         |
| received_by      | uuid                     | YES         |

## purchase_orders

| column_name         | data_type                | is_nullable |
| ------------------- | ------------------------ | ----------- |
| id                  | uuid                     | NO          |
| company_id          | uuid                     | NO          |
| supplier_id         | uuid                     | NO          |
| order_number        | integer                  | YES         |
| status              | text                     | NO          |
| notes               | text                     | YES         |
| total_cost          | real                     | YES         |
| created_at          | timestamp with time zone | YES         |
| sent_at             | timestamp with time zone | YES         |
| received_at         | timestamp with time zone | YES         |
| created_by          | uuid                     | YES         |
| required_by_date    | timestamp with time zone | YES         |
| partial_received_at | timestamp with time zone | YES         |
| partial_received_by | uuid                     | YES         |
| next_expected_date  | date                     | YES         |
| resend_email_id     | text                     | YES         |
| email_opened_at     | timestamp with time zone | YES         |

## reception_log

| column_name            | data_type                | is_nullable |
| ---------------------- | ------------------------ | ----------- |
| id                     | uuid                     | NO          |
| purchase_order_item_id | uuid                     | NO          |
| quantity_received      | integer                  | NO          |
| received_at            | timestamp with time zone | NO          |
| receiver_id            | uuid                     | YES         |
| receiver_name          | text                     | YES         |
| notes                  | text                     | YES         |
| created_at             | timestamp with time zone | NO          |

## sessions

| column_name     | data_type                | is_nullable |
| --------------- | ------------------------ | ----------- |
| id              | uuid                     | NO          |
| company_id      | uuid                     | YES         |
| job_id          | uuid                     | NO          |
| user_id         | uuid                     | NO          |
| start_time      | timestamp with time zone | NO          |
| end_time        | timestamp with time zone | YES         |
| start_latitude  | real                     | YES         |
| start_longitude | real                     | YES         |
| end_latitude    | real                     | YES         |
| end_longitude   | real                     | YES         |
| start_photo_url | text                     | YES         |
| end_photo_url   | text                     | YES         |
| duration        | real                     | YES         |
| notes           | text                     | YES         |
| created_at      | timestamp with time zone | YES         |
| allocation_id   | uuid                     | YES         |

## suppliers

| column_name  | data_type                   | is_nullable |
| ------------ | --------------------------- | ----------- |
| id           | uuid                        | NO          |
| company_id   | uuid                        | NO          |
| name         | text                        | NO          |
| contact_name | text                        | YES         |
| phone        | text                        | YES         |
| email        | text                        | YES         |
| address      | text                        | YES         |
| notes        | text                        | YES         |
| created_at   | timestamp without time zone | YES         |
| is_active    | boolean                     | YES         |
| is_internal  | boolean                     | YES         |

## support_messages

| column_name | data_type                | is_nullable |
| ----------- | ------------------------ | ----------- |
| id          | uuid                     | NO          |
| created_at  | timestamp with time zone | NO          |
| user_id     | uuid                     | YES         |
| session_id  | text                     | YES         |
| content     | text                     | NO          |
| is_from_bot | boolean                  | YES         |
| seen        | boolean                  | YES         |

## time_entries

| column_name     | data_type                | is_nullable |
| --------------- | ------------------------ | ----------- |
| id              | uuid                     | NO          |
| company_id      | uuid                     | NO          |
| user_id         | uuid                     | NO          |
| start_time      | timestamp with time zone | NO          |
| end_time        | timestamp with time zone | YES         |
| type            | text                     | NO          |
| notes           | text                     | YES         |
| created_at      | timestamp with time zone | NO          |
| start_latitude  | double precision         | YES         |
| start_longitude | double precision         | YES         |
| end_latitude    | double precision         | YES         |
| end_longitude   | double precision         | YES         |

## truck_inventory

| column_name       | data_type                | is_nullable |
| ----------------- | ------------------------ | ----------- |
| id                | uuid                     | NO          |
| truck_id          | uuid                     | NO          |
| inventory_item_id | uuid                     | NO          |
| quantity          | integer                  | NO          |
| last_updated      | timestamp with time zone | YES         |

## trucks

| column_name          | data_type                | is_nullable |
| -------------------- | ------------------------ | ----------- |
| id                   | uuid                     | NO          |
| company_id           | uuid                     | NO          |
| name                 | text                     | NO          |
| license_plate        | text                     | YES         |
| qr_code              | text                     | YES         |
| notes                | text                     | YES         |
| is_parked_at_warehouse| boolean                 | YES         |
| current_worker_id    | uuid                     | YES         |
| created_at           | timestamp with time zone | YES         |
| assigned_worker_ids  | ARRAY                    | YES         |

## warehouse_locations

| column_name | data_type                   | is_nullable |
| ----------- | --------------------------- | ----------- |
| id          | uuid                        | NO          |
| company_id  | uuid                        | NO          |
| name        | text                        | NO          |
| description | text                        | YES         |
| qr_code     | text                        | NO          |
| created_at  | timestamp without time zone | YES         |

---

## Views (read-only)

### jobs_with_workers
Enriched jobs view with `assigned_to_name` and `assigned_to_email` from profiles.

### sessions_with_details
Enriched sessions view with `job_title`, `job_address`, `user_name`, `user_email`.
