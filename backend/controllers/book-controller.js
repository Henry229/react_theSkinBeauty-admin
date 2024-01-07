import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBooks = async (req, res) => {
  try {
    const response = await prisma.book.findMany({
      include: {
        customer: true,
        service: true,
      },
      orderBy: [
        {
          customer: {
            mobile: 'asc',
          },
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const response = await prisma.book.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createBook = async (req, res) => {
  const { customerId, serviceId, startDate, endDate, realDuration, realPrice } =
    req.body;
  try {
    const book = await prisma.book.create({
      data: {
        customerId,
        serviceId,
        startDate,
        endDate,
        realDuration,
        realPrice,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBook = async (req, res) => {
  const { customerId, serviceId, startDate, endDate, realDuration, realPrice } =
    req.body;
  try {
    const book = await prisma.book.update({
      where: {
        id: req.params.id,
      },
      data: {
        customerId,
        serviceId,
        startDate,
        endDate,
        realDuration,
        realPrice,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const deleteBook = async (req, res) => {
  try {
    const book = await prisma.book.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
