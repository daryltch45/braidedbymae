# /add-translation — Add i18n Keys

Add translation keys to all three language files simultaneously.

## Input
- **namespace**: Dot-separated path (e.g., `hero`, `booking.form`, `admin.dashboard`)
- **keys**: Object with key-value pairs to add

## Steps

1. Open all three files:
   - `src/messages/fr.json`
   - `src/messages/en.json`
   - `src/messages/de.json`

2. Navigate to the correct namespace (create nested objects if they don't exist)

3. Add the keys with translations in all three languages

4. Verify JSON is valid after editing

## Example

Input: namespace=`booking.form`, keys=`{ submitButton: "...", successMessage: "..." }`

Result in `fr.json`:
```json
{
  "booking": {
    "form": {
      "submitButton": "Réserver maintenant",
      "successMessage": "Votre demande a été envoyée !"
    }
  }
}
```

Result in `en.json`:
```json
{
  "booking": {
    "form": {
      "submitButton": "Book now",
      "successMessage": "Your request has been sent!"
    }
  }
}
```

Result in `de.json`:
```json
{
  "booking": {
    "form": {
      "submitButton": "Jetzt buchen",
      "successMessage": "Ihre Anfrage wurde gesendet!"
    }
  }
}
```

## Rules
- German is the source language — write German first, then translate
- French translations should sound natural, not Google-Translate-level
- Keep keys short and descriptive (camelCase)
- Never leave a key untranslated in any language
