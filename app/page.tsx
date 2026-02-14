import Image from "next/image";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Route,
  Warehouse,
  Zap,
  Network,
  GitBranch,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const modules = [
    {
      icon: MapPin,
      title: "Paradas",
      description: "Gestión de 3,382 paradas del sistema",
      href: "/paradas",
      color: "text-[#59af31]",
      bgColor: "bg-[#59af31]/10",
    },
    {
      icon: Route,
      title: "Lí­neas",
      description: "Administra las 192 lí­neas de transporte",
      href: "/lineas",
      color: "text-[#03603a]",
      bgColor: "bg-[#03603a]/10",
    },
    {
      icon: Warehouse,
      title: "Depésito",
      description: "10 depésitos y terminales",
      href: "/deposito",
      color: "text-[#273147]",
      bgColor: "bg-[#273147]/10",
    },
    {
      icon: Zap,
      title: "Puntos de Carga",
      description: "128 puntos de recarga eléctrica",
      href: "/puntos-carga",
      color: "text-[#59af31]",
      bgColor: "bg-[#59af31]/10",
    },
    {
      icon: Network,
      title: "Datos Arco",
      description: "89,650 segmentos de conexión",
      href: "/datos-arco",
      color: "text-[#03603a]",
      bgColor: "bg-[#03603a]/10",
    },
    {
      icon: GitBranch,
      title: "Arcos Lí­nea",
      description: "Geometrí­a de rutas",
      href: "/arcos-linea",
      color: "text-[#273147]",
      bgColor: "bg-[#273147]/10",
    },
    {
      icon: Settings,
      title: "Regularización",
      description: "Control de paradas funcionales",
      href: "/paradas-regularizacion",
      color: "text-[#59af31]",
      bgColor: "bg-[#59af31]/10",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative gradient-aty text-white overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container relative z-10 px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Bus className="h-4 w-4" />
                  <span className="text-sm font-medium">Sistema GTFS</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Generador GTFS
                <br />
                <span className="text-white/90">ATY Mérida</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                Sistema integral de gestión de datos GTFS para el transporte
                público de Mérida, Yucatán. Administra paradas, lí­neas, rutas y
                más.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#59af31] hover:bg-white/90"
                >
                  <Link href="/paradas">Comenzar â†’</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="#modules">Ver módulos</Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
              <Image
                src="/Logo-oficial-ATY.svg"
                alt="Logo Oficial ATY"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="border-b bg-muted/30">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#59af31]">
                3,382
              </div>
              <div className="text-sm text-muted-foreground mt-1">Paradas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#03603a]">
                192
              </div>
              <div className="text-sm text-muted-foreground mt-1">Líneas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#273147]">
                89K+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Arcos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#59af31]">
                128
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Puntos Carga
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="modules" className="container px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Módulos del Sistema
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Accede a las diferentes secciones del generador GTFS para gestionar
            todos los aspectos del transporte público.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4`}
                    >
                      <Icon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="bg-muted/30 border-t">
        <div className="container px-4 md:px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#59af31]/10 flex items-center justify-center mx-auto mb-4">
                <Bus className="h-6 w-6 text-[#59af31]" />
              </div>
              <h3 className="text-xl font-bold">Completo</h3>
              <p className="text-muted-foreground">
                Gestión integral de todos los datos GTFS necesarios
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#03603a]/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-[#03603a]" />
              </div>
              <h3 className="text-xl font-bold">Moderno</h3>
              <p className="text-muted-foreground">
                Interfaz responsive con modo oscuro verdadero
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#273147]/10 flex items-center justify-center mx-auto mb-4">
                <Network className="h-6 w-6 text-[#273147]" />
              </div>
              <h3 className="text-xl font-bold">Eficiente</h3>
              <p className="text-muted-foreground">
                Búsqueda, filtros y paginación optimizados
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
