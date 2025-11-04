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

## Felsökning:

### 401 errors från `/api/auth/callback/credentials`
- Kontrollera att `NEXTAUTH_SECRET` är satt korrekt
- Kontrollera att `NEXTAUTH_URL` är korrekt (eller låt Vercel sätta den automatiskt)

### 500 errors från `/api/register` eller andra API routes
- Kontrollera att `DATABASE_URL` är korrekt
- Kontrollera att Prisma kan ansluta till databasen
- Kolla Vercel logs för mer detaljerad error information

### React error #419 (Hydration mismatch)
- Detta kan bero på att server och client renderar olika innehåll
- Kontrollera att alla `useSearchParams()` är wrapped i Suspense
- Kontrollera att inga client components använder server-only APIs

