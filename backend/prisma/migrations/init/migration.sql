-- CreateTable equipos
CREATE TABLE "equipos" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Operativo',
    "numeroSerie" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "equipos_numeroSerie_key" ON "equipos"("numeroSerie");
