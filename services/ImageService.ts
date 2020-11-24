import ImagekitConfig from 'Config/imagekit';
import ImageKit from 'imagekit'
import File from 'Contracts/file'
import UploadedImage from 'Contracts/uploadedImage'
import { promisify } from 'util'
import fs from 'fs'


class ImageService {
  private uploader: ImageKit

  constructor() {
    this.uploader = new ImageKit({
      publicKey: ImagekitConfig.imageKit.publicKey,
      privateKey: ImagekitConfig.imageKit.privateKey,
      urlEndpoint: 'https://ik.imagekit.io/' + ImagekitConfig.imageKit.id
    })
  }

  public uploadImage(file: File): Promise<UploadedImage> {
    const { fileName, filePath, folder, tags } = file
    return new Promise((resolve, reject) => {
      this.uploader.upload(
        { file: filePath, fileName, folder, tags: [tags] },
        (error, result) => {
          if (error) {
            reject(error)
          }

          resolve(result)
        }
      )
    })
  }
  public deleteImage(fileId: string) {
    return new Promise((resolve, reject) => {
      this.uploader.deleteFile(fileId, (error, result) => {
        if (error) reject(error)
        resolve(result)
      })
    })
  }
  public async saveImage(tmpPath: string, fileName: string, folder, tags?: string) {
    try {
      const readFile = promisify(fs.readFile)
      const unlink = promisify(fs.unlink)
      const filePath = tmpPath
      const fileRead = await readFile(filePath)
      await unlink(filePath)
      const file: File = {
        fileName,
        filePath: fileRead,
        folder,
        tags
      }
      const result = await this.uploadImage(file);
      const { thumbnailUrl, fileId, url } = result;
      return { thumbnailUrl, fileId, url, tags: result.tags?.join('') }
    } catch (error) {
      throw error;
    }
  }
  public async deleteImages(fileIds: string[]) {
    try {
      const promises = fileIds.map(fileId => this.deleteImage(fileId))
      await Promise.all(promises)
    } catch (error) {
      throw error;
    }
  }
}

export default new ImageService();