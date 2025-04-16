import { Prisma, PrismaClient, TicketStatus } from '@prisma/client';
const prisma = new PrismaClient();

const passwordHash =
  '$2a$10$gYOqQMzBS0N6mSzR5DOOM.Gqgl.F841gZmNfQRxw7ExeDEXAHOS46';

async function main() {
  // 1. Crear 10 Customers con sus Users (usando create individual para relaciones)
  await Promise.all([
    prisma.user.create({
      data: {
        name: 'Juan Pérez',
        phone: '+56912345678',
        email: 'juan.perez@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Av. Libertad 123, Santiago' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'María González',
        phone: '+56987654321',
        email: 'maria.gonzalez@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Calle Principal 456, Valparaíso' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos López',
        phone: '+56911223344',
        email: 'carlos.lopez@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Av. Providencia 789, Santiago' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Martínez',
        phone: '+56955667788',
        email: 'ana.martinez@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Paseo Bulnes 321, Santiago' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Sánchez',
        phone: '+56999887766',
        email: 'pedro.sanchez@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Av. España 654, Concepción' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Lucía Ramírez',
        phone: '+56933445566',
        email: 'lucia.ramirez@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Carrera 987, Viña del Mar' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jorge Silva',
        phone: '+56977889900',
        email: 'jorge.silva@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Av. Alemana 147, Puerto Montt' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sofía Herrera',
        phone: '+56922334455',
        email: 'sofia.herrera@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Calle Larga 258, La Serena' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Miguel Torres',
        phone: '+56966778899',
        email: 'miguel.torres@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Av. Colón 369, Valdivia' } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Elena Castro',
        phone: '+56944556677',
        email: 'elena.castro@example.com',
        password: passwordHash,
        firstLogin: true,
        customer: { create: { address: 'Pasaje Central 753, Antofagasta' } },
      },
    }),
  ]);

  // 2. Crear 5 Technicians con sus Users (usando create individual para relaciones)
  await Promise.all([
    prisma.user.create({
      data: {
        name: 'Roberto Núñez',
        phone: '+56912340000',
        email: 'roberto.nunez@example.com',
        password: passwordHash,
        firstLogin: true,
        technician: { create: { specialty: 'hardware', active: true } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Laura Méndez',
        phone: '+56912340001',
        email: 'laura.mendez@example.com',
        password: passwordHash,
        firstLogin: true,
        technician: { create: { specialty: 'software', active: true } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Andrés Ríos',
        phone: '+56912340002',
        email: 'andres.rios@example.com',
        password: passwordHash,
        firstLogin: true,
        technician: { create: { specialty: 'general', active: true } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Camila Soto',
        phone: '+56912340003',
        email: 'camila.soto@example.com',
        password: passwordHash,
        firstLogin: true,
        technician: { create: { specialty: 'hardware', active: true } },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Diego Vargas',
        phone: '+56912340004',
        email: 'diego.vargas@example.com',
        password: passwordHash,
        firstLogin: true,
        technician: { create: { specialty: 'software', active: true } },
      },
    }),
  ]);

  // 3. Crear 10 Supported Devices
  await prisma.supportedDevices.createMany({
    data: [
      { name: 'Smartphone Android' },
      { name: 'iPhone' },
      { name: 'Laptop Windows' },
      { name: 'MacBook' },
      { name: 'Tablet Android' },
      { name: 'iPad' },
      { name: 'Monitor LCD' },
      { name: 'Impresora Multifuncional' },
      { name: 'Consola de Videojuegos' },
      { name: 'Smart TV' },
    ],
    skipDuplicates: true,
  });

  // 4. Crear 5 Suppliers
  await prisma.supplier.createMany({
    data: [
      {
        name: 'ElectroParts S.A.',
        phone: '+56228887777',
        email: 'contacto@electroparts.cl',
        address: 'Av. Industrial 1234, Santiago',
      },
      {
        name: 'Componentes Digitales',
        phone: '+56229998888',
        email: 'ventas@componentesdigitales.cl',
        address: 'Calle Tech 567, Providencia',
      },
      {
        name: 'Importadora Tech',
        phone: '+56227776666',
        email: 'info@importadoratech.cl',
        address: 'Av. Providencia 3210, Santiago',
      },
      {
        name: 'Distribuidora Electrónica',
        phone: '+56226665555',
        email: 'contacto@distronic.cl',
        address: 'Av. Matta 876, Santiago',
      },
      {
        name: 'Mayorista de Componentes',
        phone: '+56225554444',
        email: null,
        address: 'Av. Santa Rosa 5432, Santiago',
      },
    ],
    skipDuplicates: true,
  });

  // 5. Crear 10 Components
  await prisma.component.createMany({
    data: [
      {
        name: 'Pantalla LCD 5.5"',
        description: 'Pantalla táctil para smartphones',
        visible: true,
      },
      {
        name: 'Batería Li-ion 3000mAh',
        description: 'Batería de repuesto para dispositivos móviles',
        visible: true,
      },
      {
        name: 'Teclado para Laptop',
        description: 'Teclado compatible con varios modelos',
        visible: true,
      },
      {
        name: 'Disco SSD 256GB',
        description: 'Unidad de estado sólido para computadores',
        visible: true,
      },
      {
        name: 'Cargador USB-C 45W',
        description: 'Cargador rápido para dispositivos modernos',
        visible: true,
      },
      {
        name: 'Placa base para iPhone X',
        description: 'Placa lógica de repuesto',
        visible: true,
      },
      {
        name: 'Ventilador para Laptop',
        description: 'Cooler de repuesto para sistemas de refrigeración',
        visible: true,
      },
      {
        name: 'Módulo de Cámara 12MP',
        description: 'Cámara trasera para smartphones',
        visible: true,
      },
      {
        name: 'Conector de Carga',
        description: 'Puerto de carga para dispositivos móviles',
        visible: true,
      },
      {
        name: 'Tarjeta WiFi',
        description: 'Módulo de conexión inalámbrica para laptops',
        visible: true,
      },
    ],
    skipDuplicates: true,
  });

  // Obtener IDs para crear relaciones (necesario para purchases y componentStocks)
  const suppliers = await prisma.supplier.findMany();
  const components = await prisma.component.findMany();

  // 6. Crear 3 purchases por componente (de diferentes proveedores)
  const purchasesData: Prisma.PurchaseCreateManyInput[] = [];

  components.forEach((component) => {
    // Seleccionar 3 proveedores aleatorios para cada componente
    const shuffledSuppliers = [...suppliers].sort(() => 0.5 - Math.random());
    const selectedSuppliers = shuffledSuppliers.slice(0, 3);

    selectedSuppliers.forEach((supplier, idx) => {
      const unitPrice = parseFloat((10 + Math.random() * 90).toFixed(2)); // Precio entre 10 y 100
      const quantity = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)]; // Cantidades típicas

      purchasesData.push({
        supplierId: supplier.id,
        componentId: component.id,
        quantity,
        unitPrice,
        purchaseDate: new Date(2023, 0, idx + 1), // Fechas diferentes para cada compra
        deliveryDate: new Date(2023, 0, idx + 3),
        status: 'completed',
      });
    });
  });

  await prisma.purchase.createMany({ data: purchasesData });

  // 7. Crear ComponentStocks (1 por componente con inUse: true, más otros)
  const componentStocksData: Prisma.ComponentStockCreateManyInput[] = [];

  components.forEach((component) => {
    // Seleccionar 3 proveedores aleatorios para cada componente
    const shuffledSuppliers = [...suppliers].sort(() => 0.5 - Math.random());
    const selectedSuppliers = shuffledSuppliers.slice(0, 3);

    selectedSuppliers.forEach((supplier, idx) => {
      const unitPrice = parseFloat((10 + Math.random() * 90).toFixed(2)); // Mismo rango que purchases
      const stock = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
      const minimumStock = 5;

      componentStocksData.push({
        componentId: component.id,
        supplierId: supplier.id,
        stock,
        minimumStock,
        unitPrice,
        inUse: idx === 0, // El primero de cada componente está en uso
      });
    });
  });

  await prisma.componentStock.createMany({ data: componentStocksData });

  // 8. Crear SupportTickets (3 por día laboral desde 1 de enero hasta 11 de abril)
  const customers = await prisma.customer.findMany();
  const technicians = await prisma.technician.findMany();
  const devices = await prisma.supportedDevices.findMany();
  const componentStocks = await prisma.componentStock.findMany();

  const startDate = new Date(2023, 0, 1); // 1 de enero
  const endDate = new Date(2023, 3, 11); // 11 de abril
  const ticketsData: Prisma.SupportTicketCreateManyInput[] = [];
  const repairsData: Prisma.RepairCreateManyInput[] = [];
  const usedComponentsData: Prisma.UsedComponentCreateManyInput[] = [];

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    // Saltar fines de semana (sábado 6, domingo 0)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Crear 3 tickets por día laboral
    for (let i = 0; i < 3; i++) {
      const isCompleted = date < new Date(2023, 3, 4); // Completados hasta 4 de abril
      const status = isCompleted
        ? TicketStatus.completed
        : Math.random() > 0.7
          ? TicketStatus.in_progress
          : TicketStatus.pending;

      const ticket = {
        customerId: customers[Math.floor(Math.random() * customers.length)].id,
        assignedTechnicianId:
          Math.random() > 0.3
            ? technicians[Math.floor(Math.random() * technicians.length)].id
            : null,
        deviceTypeId: devices[Math.floor(Math.random() * devices.length)].id,
        brand: ['Samsung', 'Apple', 'HP', 'Dell', 'LG', 'Sony', 'Xiaomi'][
          Math.floor(Math.random() * 7)
        ],
        problemDescription: [
          'No enciende',
          'Pantalla rota',
          'No carga',
          'Problemas de rendimiento',
          'Falla de audio',
          'Sobrecalentamiento',
          'Problemas de conectividad',
        ][Math.floor(Math.random() * 7)],
        status,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as
          | 'low'
          | 'medium'
          | 'high',
        model: `MOD-${Math.floor(1000 + Math.random() * 9000)}`,
        serialNumber: `SN${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`,
        requestDate: new Date(date),
        closeDate: isCompleted
          ? new Date(
              date.getTime() + (2 + Math.random() * 5) * 24 * 60 * 60 * 1000,
            )
          : null,
      };

      ticketsData.push(ticket);
    }
  }

  // Insertar todos los tickets
  await prisma.supportTicket.createMany({ data: ticketsData });

  // Para los tickets completados, crear reparaciones y componentes usados
  const completedTickets = await prisma.supportTicket.findMany({
    where: { status: 'completed' },
  });

  completedTickets.forEach((ticket) => {
    const repairDate = new Date(ticket.requestDate);
    repairDate.setDate(repairDate.getDate() + 1);

    const endDate = new Date(repairDate);
    endDate.setDate(endDate.getDate() + (1 + Math.random() * 3));

    repairsData.push({
      supportTicketId: ticket.id,
      diagnosis: [
        'Falla en la placa madre',
        'Pantalla dañada',
        'Batería agotada',
        'Problema de software',
        'Componente dañado por líquido',
      ][Math.floor(Math.random() * 5)],
      startDate: repairDate,
      appliedSolution: [
        'Reemplazo de componente',
        'Reparación de circuito',
        'Actualización de firmware',
        'Limpieza interna',
        'Reemplazo completo',
      ][Math.floor(Math.random() * 5)],
      endDate,
      estimatedCost: parseFloat((50 + Math.random() * 200).toFixed(2)),
    });
  });

  // Insertar todas las reparaciones
  await prisma.repair.createMany({ data: repairsData });

  // Para cada reparación, agregar 3-5 componentes usados (algunas sin componentes)
  const repairs = await prisma.repair.findMany();

  repairs.forEach((repair) => {
    if (Math.random() > 0.2) {
      // 80% de probabilidad de usar componentes
      const numComponents = 3 + Math.floor(Math.random() * 3); // 3-5 componentes
      const shuffledStocks = [...componentStocks].sort(
        () => 0.5 - Math.random(),
      );
      const selectedStocks = shuffledStocks.slice(0, numComponents);

      selectedStocks.forEach((stock) => {
        usedComponentsData.push({
          repairId: repair.id,
          componentStockId: stock.id,
          quantity: 1 + Math.floor(Math.random() * 3), // 1-3 unidades
        });
      });
    }
  });

  // Insertar todos los componentes usados
  await prisma.usedComponent.createMany({ data: usedComponentsData });

  console.log('Seeder ejecutado con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
