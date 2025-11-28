import { TiTick, IoIosWarning, FiRefreshCw } from '../../../public/Icons.js'
import '../../../public/styles/common.css'
import './FileUploadResult.css'

interface FileUploadResultProps {
    status: string, 
    fileType: string
}


const FileUploadResult = ({ status, fileType }: FileUploadResultProps) => {
    if (status === 'success') {
      return <p className='file-upload-status success'><TiTick /> {fileType} Uploaded Successfully!</p>;
    } else if (status === 'fail') {
      return <p className='file-upload-status fail'><IoIosWarning /> {fileType} Upload Failed!</p>;
    } else if (status === 'uploading') {
      return <p className='file-upload-status uploading'><FiRefreshCw /> Uploading Selected {fileType}...</p>;
    } else {
      return null;
    }
};

export default FileUploadResult