import { Request, Response } from 'express';
import { createAsyncFunction } from '../../utils/create.asyncFunction';
import { blogServices } from './blogs.services';
import { sendResponse } from '../../utils/send.response';
import httpStatusCode from 'http-status-codes';

const createBlog = createAsyncFunction(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    image: req?.file?.path,
  };
  const data = await blogServices.createBlog(payload);
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Blog created successfully',
    data,
  });
});

const getAllBlogs = createAsyncFunction(async (req: Request, res: Response) => {
  const data = await blogServices.getAllBlogs(
    req.query as Record<string, string>
  );
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Blogs found successfully',
    data,
  });
});

const getSingleBlog = createAsyncFunction(
  async (req: Request, res: Response) => {
    const data = await blogServices.getSingleBlog(req.params.slug as string);
    //send response
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Blog found successfully',
      data,
    });
  }
);

const updateBlog = createAsyncFunction(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    image: req?.file?.path,
  };
  console.log(req.body)
  console.log(req.params.id)
  const data = await blogServices.updateBlog(req.params.id as string, payload);
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Blog updated successfully',
    data,
  });
});

const deleteBlog = createAsyncFunction(async (req: Request, res: Response) => {
  const data = await blogServices.deleteBlog(req.params.id as string);
  //send response
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Blog deleted successfully',
    data,
  });
});

export const blogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
