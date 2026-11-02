import { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

export default function EncryptForm() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !key) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userKey', key);
      formData.append('originalFilename', file.name);
      formData.append('mimeType', file.type);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/encrypt`,
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'encrypted.bin');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Encryption failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const fileUploadVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <motion.div 
        variants={itemVariants}
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg sm:p-8"
      >
        <motion.div 
          variants={itemVariants}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-lg font-bold text-white sm:p-6"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Encrypt Your File
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-1 text-sm font-normal text-indigo-100"
          >
            Upload your file and provide a secret key to encrypt it securely
          </motion.p>
        </motion.div>

        <motion.form 
          variants={containerVariants}
          className="mt-6 space-y-6" 
          onSubmit={handleSubmit}
        >
          <motion.div variants={itemVariants}>
            <label className="text-sm font-semibold text-slate-700">Upload File</label>
            <motion.div 
              variants={fileUploadVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="relative mt-2 flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 transition-colors hover:border-indigo-500 hover:bg-indigo-50/50"
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="flex flex-col items-center p-4 text-center">
                <FiUpload className="mb-2 h-8 w-8 text-indigo-500" />
                <p className="text-sm text-slate-600">
                  {file ? (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate max-w-xs"
                    >
                      {file.name} <span className="text-slate-400">({(file.size / 1024).toFixed(2)} KB)</span>
                    </motion.span>
                  ) : (
                    <>
                      {isMobile ? 'Tap to select file' : 'Drag & drop your file or click to browse'}
                    </>
                  )}
                </p>
                {file && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-emerald-700"
                  >
                    File ready for encryption
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="encryption-key" className="text-sm font-semibold text-slate-700">Encryption Key</label>
            <div className="relative mt-2">
              <motion.input
                id="encryption-key"
                type={isKeyVisible ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Enter your secret key"
                autoComplete="new-password"
                required
                whileFocus={{
                  boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)"
                }}
              />
              <button
                type="button"
                onClick={() => setIsKeyVisible((visible) => !visible)}
                className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-slate-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-label={isKeyVisible ? "Hide encryption key" : "Show encryption key"}
                aria-pressed={isKeyVisible}
              >
                {isKeyVisible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Keep this key somewhere safe. You’ll need it when decrypting.</p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="rounded-full h-5 w-5 border-b-2 border-white"
                ></motion.div>
              ) : (
                <>
                  <FiLock className="w-5 h-5" />
                  Encrypt File
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div 
          variants={itemVariants}
          className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
        >
          <h3 className="mb-2 font-semibold text-slate-900">How to encrypt your file</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <motion.li 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Upload your file using the upload area above
            </motion.li>
            <motion.li 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Enter your custom encryption key
            </motion.li>
            <motion.li 
              custom={2}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Click "Encrypt File" and download will begin automatically
            </motion.li>
            <motion.li 
              custom={3}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Save your encryption key securely — you'll need it to decrypt
            </motion.li>
          </ol>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}