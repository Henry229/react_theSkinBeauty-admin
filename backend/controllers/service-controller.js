import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getServices = async (req, res) => {
  try {
    const response = await prisma.service.findMany({
      include: {
        category: true,
      },
      orderBy: [
        {
          category: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const response = await prisma.service.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createService = async (req, res) => {
  const { name, price, duration, categoryId } = req.body;
  try {
    const service = await prisma.service.create({
      data: {
        name,
        price,
        duration,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateService = async (req, res) => {
  const { name, price, duration, categoryId } = req.body;
  try {
    const service = await prisma.service.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        price,
        duration,
        categoryId,
      },
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const deleteService = async (req, res) => {
  try {
    const service = await prisma.service.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
