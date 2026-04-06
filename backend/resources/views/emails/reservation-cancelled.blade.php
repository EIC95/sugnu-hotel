<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h1 style="color: #2d6a4f;">🏨 SugnuHotel</h1>
    <h2>Annulation de réservation</h2>
    <p>Bonjour {{ $reservation->user->name }},</p>
    <p>Votre réservation a été annulée.</p>

    <table style="border-collapse: collapse; width: 100%;">
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Numéro de réservation</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $reservation->reservation_number }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Chambre</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $reservation->room->room_number }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Check-in</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $reservation->check_in_date }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Check-out</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $reservation->check_out_date }}</td>
        </tr>
    </table>

    <p style="margin-top: 20px;">Nous espérons vous revoir bientôt !</p>
    <p><strong>L'équipe SugnuHotel</strong></p>
</body>
</html>