import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GTFS Generator - ATY Mérida",
  description:
    "Sistema de gestión GTFS para transporte público de Mérida, Yucatán",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { href: "/paradas", label: "Paradas" },
    { href: "/lineas", label: "Líneas" },
    { href: "/deposito", label: "Depósito" },
    { href: "/puntos-carga", label: "Puntos de Carga" },
    { href: "/datos-arco", label: "Datos Arco" },
    { href: "/arcos-linea", label: "Arcos Lí­nea" },
    { href: "/paradas-regularizacion", label: "Regularización" },
  ];

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* HEADER PRINCIPAL */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
              {/* LOGO ATY */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative h-10 w-10 md:h-12 md:w-12">
                  <Image
                    src="/logo-ATY.svg"
                    alt="ATY Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="font-bold text-lg leading-tight">
                    ATY MÉRIDA
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Generador GTFS
                  </span>
                </div>
              </Link>

              {/* NAVEGACIÓN DESKTOP */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* ACCIONES */}
              <div className="flex items-center space-x-2">
                <ThemeToggle />

                {/* MENÚ MÓVIL */}
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col space-y-4 mt-8">
                      <div className="flex items-center space-x-3 pb-4 border-b">
                        <div className="relative h-12 w-12">
                          <Image
                            src="/logo-ATY.svg"
                            alt="ATY Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">ATY MÉRIDA</span>
                          <span className="text-xs text-muted-foreground">
                            Generador GTFS
                          </span>
                        </div>
                      </div>

                      <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          {/* CONTENIDO PRINCIPAL */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>

          {/* FOOTER */}
          <footer className="border-t bg-muted/50">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4 md:px-6">
              <div className="flex items-center space-x-3">
                <div className="relative h-8 w-8">
                  <Image
                    src="/logo-ATY.svg"
                    alt="ATY Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">
                    Agencia de Transporte de Yucatán
                  </p>
                  <p className="text-xs">Sistema GTFS Â© 2025</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>Mérida, Yucatán</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </footer>

          {/* NOTIFICACIONES */}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
