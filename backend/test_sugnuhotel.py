import requests
import json

BASE_URL = "http://localhost:8000/api"
admin_token = None
client_token = None
reservation_id = None

def print_result(test_name, response):
    status = "✅" if response.status_code in [200, 201] else "❌"
    print(f"{status} {test_name} — Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except:
        print(response.text)
    print("-" * 60)

def headers(token):
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

print("=" * 60)
print("🏨 TESTS API SUGNUHOTEL")
print("=" * 60)

# ─── AUTH ───────────────────────────────────────────────────────

print("\n📌 AUTH\n")

# Login Admin
r = requests.post(f"{BASE_URL}/login", json={
    "email": "admin@sugnuhotel.com",
    "password": "password123"
})
print_result("Login Admin", r)
if r.status_code == 200:
    admin_token = r.json().get("token")

# Register Client
r = requests.post(f"{BASE_URL}/register", json={
    "name": "Amadou Diallo",
    "email": "amadou@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "771234567"
})
print_result("Register Client", r)
if r.status_code == 201:
    client_token = r.json().get("token")

# Login Client (si déjà inscrit)
if not client_token:
    r = requests.post(f"{BASE_URL}/login", json={
        "email": "amadou@test.com",
        "password": "password123"
    })
    print_result("Login Client (existant)", r)
    if r.status_code == 200:
        client_token = r.json().get("token")

# Me
r = requests.get(f"{BASE_URL}/me", headers=headers(admin_token))
print_result("Me (Admin)", r)

# ─── ROOM TYPES ─────────────────────────────────────────────────

print("\n📌 ROOM TYPES\n")

r = requests.get(f"{BASE_URL}/room-types")
print_result("Liste types de chambres", r)

r = requests.post(f"{BASE_URL}/room-types", headers=headers(admin_token), json={
    "name": "VIP",
    "description": "Chambre VIP exclusive",
    "base_price": 120000,
    "max_occupancy": 2
})
print_result("Créer type de chambre (Admin)", r)

r = requests.get(f"{BASE_URL}/room-types/1")
print_result("Détail type de chambre", r)

# ─── ROOMS ──────────────────────────────────────────────────────

print("\n📌 ROOMS\n")

r = requests.get(f"{BASE_URL}/rooms")
print_result("Liste chambres", r)

r = requests.post(f"{BASE_URL}/rooms", headers=headers(admin_token), json={
    "room_number": "401",
    "room_type_id": 1,
    "floor": 4,
    "price_per_night": 30000,
    "max_occupancy": 2
})
print_result("Créer chambre (Admin)", r)

# Chambres disponibles
r = requests.get(f"{BASE_URL}/rooms/available", params={
    "check_in_date": "2026-04-01",
    "check_out_date": "2026-04-05",
    "number_of_adults": 2
})
print_result("Chambres disponibles", r)

# ─── SERVICES ───────────────────────────────────────────────────

print("\n📌 SERVICES\n")

r = requests.get(f"{BASE_URL}/services", headers=headers(admin_token))
print_result("Liste services", r)

r = requests.post(f"{BASE_URL}/services", headers=headers(admin_token), json={
    "name": "Room Service",
    "description": "Service en chambre 24h/24",
    "price": 10000
})
print_result("Créer service (Admin)", r)

# ─── RESERVATIONS ───────────────────────────────────────────────

print("\n📌 RESERVATIONS\n")

r = requests.post(f"{BASE_URL}/reservations", headers=headers(client_token), json={
    "room_id": 1,
    "check_in_date": "2026-04-01",
    "check_out_date": "2026-04-05",
    "number_of_adults": 2,
    "number_of_children": 0,
    "special_requests": "Vue sur la mer si possible",
    "services": [
        {"id": 1, "quantity": 2, "price": 5000},
        {"id": 2, "quantity": 1, "price": 2000}
    ]
})
print_result("Créer réservation (Client)", r)
if r.status_code == 201:
    reservation_id = r.json().get("id")

# Double booking test
r = requests.post(f"{BASE_URL}/reservations", headers=headers(client_token), json={
    "room_id": 1,
    "check_in_date": "2026-04-02",
    "check_out_date": "2026-04-04",
    "number_of_adults": 1
})
print_result("Double booking (doit échouer ❌)", r)

if reservation_id:
    r = requests.get(f"{BASE_URL}/reservations/{reservation_id}", headers=headers(client_token))
    print_result("Détail réservation", r)

# ─── CHECK-IN / CHECK-OUT ───────────────────────────────────────

print("\n📌 CHECK-IN / CHECK-OUT\n")

if reservation_id:
    # Confirmer d'abord
    r = requests.put(f"{BASE_URL}/reservations/{reservation_id}", headers=headers(admin_token), json={
        "status": "confirmed"
    })
    print_result("Confirmer réservation (Admin)", r)

    r = requests.post(f"{BASE_URL}/reservations/{reservation_id}/checkin", headers=headers(admin_token))
    print_result("Check-in (Réceptionniste)", r)

    r = requests.post(f"{BASE_URL}/reservations/{reservation_id}/checkout", headers=headers(admin_token))
    print_result("Check-out (Réceptionniste)", r)

# ─── DASHBOARD ──────────────────────────────────────────────────

print("\n📌 DASHBOARD\n")

r = requests.get(f"{BASE_URL}/dashboard", headers=headers(admin_token))
print_result("Dashboard Admin", r)

# ─── PROMOTIONS ─────────────────────────────────────────────────

print("\n📌 PROMOTIONS\n")

r = requests.post(f"{BASE_URL}/promotions", headers=headers(admin_token), json={
    "code": "DAKAR2026",
    "description": "Promotion spéciale Dakar",
    "discount": 10000,
    "is_percentage": False,
    "starts_at": "2026-01-01",
    "ends_at": "2026-12-31"
})
print_result("Créer promotion (Admin)", r)

r = requests.post(f"{BASE_URL}/promotions/check", json={"code": "DAKAR2026"})
print_result("Vérifier code promo", r)

r = requests.post(f"{BASE_URL}/promotions/check", json={"code": "FAUX123"})
print_result("Code promo invalide (doit échouer ❌)", r)

# ─── REVIEWS ────────────────────────────────────────────────────

print("\n📌 REVIEWS\n")

if reservation_id:
    r = requests.post(f"{BASE_URL}/reviews", headers=headers(client_token), json={
        "reservation_id": reservation_id,
        "rating": 5,
        "comment": "Excellent séjour, personnel très accueillant !"
    })
    print_result("Créer avis (Client)", r)

# ─── RECEPTIONNISTE ─────────────────────────────────────────────

print("\n📌 CRÉER RÉCEPTIONNISTE\n")

r = requests.post(f"{BASE_URL}/receptionists", headers=headers(admin_token), json={
    "name": "Fatou Sall",
    "email": "fatou@sugnuhotel.com",
    "password": "password123",
    "phone": "781234567"
})
print_result("Créer réceptionniste (Admin)", r)

# ─── LOGOUT ─────────────────────────────────────────────────────

print("\n📌 LOGOUT\n")

r = requests.post(f"{BASE_URL}/logout", headers=headers(admin_token))
print_result("Logout Admin", r)

r = requests.post(f"{BASE_URL}/logout", headers=headers(client_token))
print_result("Logout Client", r)

print("\n" + "=" * 60)
print("🏁 TESTS TERMINÉS")
print("=" * 60)