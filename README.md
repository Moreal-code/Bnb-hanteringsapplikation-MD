# Airbnb Clone - Next.js App

Detta är en Airbnb-klon byggd med Next.js, TypeScript, Prisma och MongoDB.

## Förutsättningar

- Node.js 18+ installerat
- MongoDB databas (lokal eller MongoDB Atlas)
- npm, yarn, pnpm eller bun

## Installation

1. **Klona repot och installera dependencies:**

```bash
npm install
# eller
yarn install
# eller
pnpm install
```

2. **Skapa `.env` fil i root-mappen med följande variabler:**

```env
DATABASE_URL="mongodb://localhost:27017/my-airbnb-app"
# eller för MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/my-airbnb-app"

NEXTAUTH_SECRET="din-hemliga-nyckel-här"
NEXTAUTH_URL="http://localhost:3000"

# För bilduppladdning (Cloudinary):
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="ditt-cloudinary-namn"
```

3. **Generera Prisma Client:**

```bash
npx prisma generate
```

4. **Pusha databas-schemat till MongoDB:**

```bash
npx prisma db push
```

## Köra applikationen

### Development Server

```bash
npm run dev
# eller
yarn dev
# eller
pnpm dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Production Build

```bash
npm run build
npm start
```

## API Routes

Applikationen har följande API-rutter för listings (Property):

- **GET** `/api/listings` - Hämta alla listings (med query-parametrar för filtrering)
- **GET** `/api/listings/[id]` - Hämta en specifik listing
- **POST** `/api/listings` - Skapa ny listing (kräver autentisering)
- **PUT** `/api/listings/[id]` - Uppdatera listing (kräver autentisering)
- **DELETE** `/api/listings/[id]` - Radera listing (kräver autentisering)

### Testa API-rutterna

**GET (i webbläsare):**

```
http://localhost:3000/api/listings
http://localhost:3000/api/listings/[listingId]
```

**För POST/PUT/DELETE** behöver du vara inloggad. Testa via applikationens UI eller använd Postman/Insomnia med session cookies.

## Projektstruktur

```
app/
├── api/              # API-rutter
│   ├── listings/     # Property CRUD operations
│   └── reservations/ # Booking operations
├── actions/          # Server Actions
├── components/       # React-komponenter
└── ...
prisma/
└── schema.prisma     # Databas-schema
```

## Teknologier

- **Next.js 15** - React framework
- **TypeScript** - Typad JavaScript
- **Prisma** - ORM för MongoDB
- **NextAuth** - Autentisering
- **Tailwind CSS** - Styling
- **Axios** - HTTP-klient

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
