# Vercel Environment Variables Setup

För att applikationen ska fungera korrekt i Vercel production, behöver följande environment variables sättas:

## Required Environment Variables

1. **DATABASE_URL**
   - MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Du kan få detta från MongoDB Atlas eller din MongoDB provider

2. **NEXTAUTH_SECRET**
   - En hemlig nyckel för NextAuth session encryption
   - Generera med: `openssl rand -base64 32` eller använd en online generator
   - **VIKTIGT**: Denna måste vara samma i alla environments (development, production)

3. **NEXTAUTH_URL** (optional men rekommenderat)
   - Din production URL
   - Format: `https://your-app.vercel.app`
   - Vercel sätter detta automatiskt, men kan vara bra att sätta explicit

## Hur man sätter environment variables i Vercel:

1. Gå till ditt Vercel projekt
2. Klicka på **Settings**
3. Gå till **Environment Variables**
4. Lägg till varje variabel:
   - **Name**: `DATABASE_URL`
   - **Value**: Din MongoDB connection string
   - **Environment**: Production, Preview, Development (välj alla)
5. Upprepa för `NEXTAUTH_SECRET`

## Efter att ha satt environment variables:

1. Gå till **Deployments**
2. Klicka på tre prickarna på den senaste deployment
3. Klicka på **Redeploy**
4. Välj **Use existing Build Cache** (eller låt den rebuilda)

## MongoDB Atlas Network Access (VIKTIGT!)

För att applikationen ska kunna ansluta till MongoDB Atlas från Vercel, måste du tillåta Vercels IP-adresser:

### Steg 1: Tillåt alla IP-adresser (Rekommenderat för development)
1. Gå till MongoDB Atlas Dashboard
2. Klicka på **Network Access** i vänstermenyn
3. Klicka på **Add IP Address**
4. Klicka på **Allow Access from Anywhere**
5. Detta lägger till `0.0.0.0/0` (tillåter alla IP-adresser)
6. Klicka **Confirm**

⚠️ **Säkerhet**: För production, överväg att bara tillåta specifika IP-adresser.

### Steg 2: Kontrollera Connection String
Din `DATABASE_URL` ska se ut så här:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

Om du får SSL/TLS fel, lägg till dessa parametrar:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=false
```

### Steg 3: Kontrollera Database User
1. Gå till **Database Access** i MongoDB Atlas
2. Kontrollera att din användare har rätt behörigheter
3. Om du behöver skapa en ny användare:
   - Klicka **Add New Database User**
   - Välj **Password** authentication
   - Ge användaren **Read and write to any database** behörighet
   - Spara lösenordet säkert!

## Felsökning:

### "Server selection timeout" eller "No available servers"
- **Lösning**: Kontrollera MongoDB Atlas Network Access (se ovan)
- Se till att `0.0.0.0/0` är tillagd i Network Access
- Det kan ta några minuter innan ändringar träder i kraft

### "received fatal alert: InternalError"
- Detta är ofta ett nätverksblockeringsproblem
- Kontrollera Network Access i MongoDB Atlas
- Kontrollera att connection string är korrekt

### 401 errors från `/api/auth/callback/credentials`
- Kontrollera att `NEXTAUTH_SECRET` är satt korrekt
- Kontrollera att `NEXTAUTH_URL` är korrekt (eller låt Vercel sätta den automatiskt)

### 500 errors från `/api/register` eller andra API routes
- Kontrollera att `DATABASE_URL` är korrekt
- Kontrollera att Prisma kan ansluta till databasen
- Kolla Vercel logs för mer detaljerad error information
- **Kontrollera MongoDB Atlas Network Access** (detta är ofta problemet!)

### React error #419 (Hydration mismatch)
- Detta kan bero på att server och client renderar olika innehåll
- Kontrollera att alla `useSearchParams()` är wrapped i Suspense
- Kontrollera att inga client components använder server-only APIs

