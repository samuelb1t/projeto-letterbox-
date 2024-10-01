import { PrismaClient } from "@prisma/client";

export type MovieReview = {
  title: string;
  review?: string;
  note: number;
};

export  type NewUser = {
  name?: string;
  email: string;
};

const prisma = new PrismaClient();

export function findUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export function findAllUsers() {
  return prisma.user.findMany();
}

export function addUser(newUser: NewUser) {
  return prisma.user.create({
    data: {
      name: newUser.name,
      email: newUser.email,
      reviewedMovies: {
        
      },
    },
  });
}

export function updateUser(newData: NewUser, id: string) {
  return prisma.user.update({
    where: { id },
    data: newData,
  });
}

export function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

export function deleteAll() {
  return prisma.user.deleteMany();
}

export function addMovie(id: string, review: MovieReview) {
  return prisma.user.update({
    where: { id },
    data: {
      reviewedMovies: {
        create: {
          title: review.title,
          review: review.review,
          note: review.note,
        },
      },  
    },
  });
}

export function userReviews(id:string){
  return prisma.user.findUnique({
    where: {id},
    include:{
      reviewedMovies: true,
    }
  })
}

export async function jaAvaliou(id:string,title:string){
  const user = await prisma.user.findUnique({
    where: {id},
    include:{
      reviewedMovies:{
        where:{title},
      },
    },
  });
  if(user?.reviewedMovies.length != 0){
    return true;
  }
  return false;
}

export function updateReview(id:string,newReview:MovieReview){
  return prisma.user.update({
    where:{id},
    data:{
      reviewedMovies: {
        updateMany:{
          where: {title : newReview.title},
          data: newReview,
        },
      },
    },
  });
}

function deleteReview(id:string,title:string){
  return prisma.user.update({
    where: {id},
    data:{
      reviewedMovies:{
        deleteMany:{
          where:{title},
        },
      },
    },
  });
}
