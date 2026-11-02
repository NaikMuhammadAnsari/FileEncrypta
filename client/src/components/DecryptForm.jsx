"use client"

import { useState, useCallback } from "react"
import axios from "axios"
import { FiDownload, FiKey, FiFile, FiCheck, FiAlertCircle, FiCopy, FiArrowRight } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

export default function DecryptForm() {
  const [file, setFile] = useState(null)
  const [decryptedKey, setDecryptedKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setError("")
    }
  }, [])

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }, [])

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(decryptedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [decryptedKey])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file to decrypt")
      return
    }

    try {
      setLoading(true)
      setError("")
      const formData = new FormData()
      formData.append("file", file)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/decrypt`, formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setDecryptedKey(response.headers["x-user-key"])

      // Extract original filename
      const contentDisposition = response.headers["content-disposition"]
      const filename = contentDisposition.split("filename=")[1].replace(/"/g, "")

      // Create download link
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      setSuccess(true)
    } catch (err) {
      setError("Decryption failed. Invalid file or key!")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 sm:px-8 sm:py-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Decrypt Your File</h2>
          <p className="text-indigo-100 mt-1 text-sm sm:text-base">
            Upload your encrypted file to decrypt and retrieve your original content
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  file ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                <FiFile className="w-4 h-4" />
              </div>
              <span className="mt-2 text-xs text-slate-600">Select File</span>
            </div>
            <div className="mx-2 h-1 flex-1 bg-slate-200">
              <div
                className={`h-full ${
                  loading || success ? "bg-indigo-600" : "bg-slate-200"
                } transition-all duration-300`}
                style={{ width: file ? "100%" : "0%" }}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  loading
                    ? "bg-indigo-600 text-white animate-pulse"
                    : success
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : success ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiKey className="w-4 h-4" />
                )}
              </div>
              <span className="mt-2 text-xs text-slate-600">Decrypt</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Upload Encrypted File
              </label>
              <div
                className={`relative flex items-center justify-center w-full border-2 ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : file
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-dashed border-slate-300"
                } rounded-lg transition-all duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label className="flex flex-col w-full h-40 sm:h-48 cursor-pointer">
                  <div className="flex flex-col items-center justify-center h-full py-6 px-4 text-center">
                    <AnimatePresence mode="wait">
                      {file ? (
                        <motion.div
                          key="file-selected"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center"
                        >
                          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                            <FiFile className="h-8 w-8 text-emerald-700" />
                          </div>
                          <p className="break-all text-sm font-medium text-slate-900">{file.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="mt-3 text-xs text-indigo-700 hover:text-indigo-900"
                          >
                            Change file
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="no-file"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center"
                        >
                          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                            <FiDownload className="h-8 w-8 text-indigo-700" />
                          </div>
                          <p className="break-all text-sm font-medium text-slate-900">
                            Drag & drop your encrypted file here
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            or <span className="text-indigo-700">browse</span> to choose a file
                          </p>
                          <p className="mt-3 text-xs text-slate-500">Supports .bin encrypted files</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full ${
                !file
                  ? "cursor-not-allowed bg-slate-300"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Decrypting...</span>
                </div>
              ) : (
                <>
                  <FiKey className="w-5 h-5" />
                  <span>Decrypt File</span>
                  <FiArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Decrypted Key Display */}
            <AnimatePresence>
              {decryptedKey && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <FiKey className="h-5 w-5 text-indigo-700" />
                        <span className="font-medium text-slate-900">Your Encryption Key:</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="rounded-md p-1.5 text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-900"
                      >
                        {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-indigo-200/30 to-transparent animate-pulse-slow"></div>
                      <code className="block w-full break-all rounded border border-slate-200 bg-white p-3 font-mono text-sm text-slate-800">
                        {decryptedKey}
                      </code>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Keep this key safe! You'll need it to decrypt this file again in the future.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  <FiCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">File successfully decrypted!</p>
                    <p className="mt-1">Your file has started downloading automatically.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>

      {/* Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <h3 className="mb-3 text-lg font-semibold text-slate-900">How to decrypt your file</h3>
        <ol className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              1
            </div>
            <span>Upload your encrypted .bin file using the drag & drop area above</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              2
            </div>
            <span>Click the "Decrypt File" button to start the decryption process</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              3
            </div>
            <span>Your original file will download automatically once decryption is complete</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              4
            </div>
            <span>Save your encryption key for future use - you'll need it to decrypt this file again</span>
          </li>
        </ol>
      </motion.div>
    </div>
  )
}
