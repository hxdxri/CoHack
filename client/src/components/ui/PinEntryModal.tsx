import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

interface PinEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => Promise<boolean>;
  orderId: string;
  customerName: string;
}

/**
 * PIN Entry Modal
 * 
 * Modal for farmers to enter delivery PIN provided by customers
 * to confirm order delivery. Includes validation and error handling.
 */
export const PinEntryModal: React.FC<PinEntryModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  orderId,
  customerName
}) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin.trim()) {
      setError('Please enter a delivery PIN');
      return;
    }

    if (pin.length < 4) {
      setError('PIN must be at least 4 characters');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = await onVerify(pin);
      
      if (isValid) {
        setSuccess(true);
        // Close modal after a brief success display
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError('Invalid PIN, please double-check with the customer.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    if (!isVerifying) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-ink">
              Confirm Delivery
            </h2>
            <p className="text-sm text-graphite mt-1">
              Order #{orderId} • {customerName}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isVerifying}
            className="p-2 text-graphite hover:text-ink transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              Delivery Confirmed! 🎉
            </h3>
            <p className="text-graphite">
              Order has been successfully marked as delivered.
            </p>
          </div>
        )}

        {/* PIN Entry Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="delivery-pin" className="block text-sm font-medium text-ink mb-2">
                Enter delivery PIN provided by the customer
              </label>
              <Input
                id="delivery-pin"
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4+ digit PIN"
                className="text-center text-lg tracking-widest"
                maxLength={10}
                disabled={isVerifying}
                autoFocus
              />
              <p className="text-xs text-graphite mt-2">
                Ask the customer for their delivery confirmation PIN
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isVerifying}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isVerifying || !pin.trim()}
                className="flex-1"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Delivery
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
