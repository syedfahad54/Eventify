import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Smartphone, CreditCard, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: (paymentMethod: string) => void;
   totalAmount: number;
   ticketCount: number;
   isProcessing: boolean;
 }

interface PaymentMethod {
   id: string;
   name: string;
   icon: React.ReactNode;
   description: string;
   qrCode?: string;
 }

export const PaymentDialog = ({
  open,
  onOpenChange,
  onConfirm,
  totalAmount,
  ticketCount,
  isProcessing
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('jazzcash');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay with JazzCash mobile wallet',
      qrCode: `JAZZCASH:PAY:${totalAmount}:${Date.now()}`
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay with EasyPaisa mobile wallet',
      qrCode: `EASYPAISA:PAY:${totalAmount}:${Date.now()}`
    },
    {
      id: 'nayapay',
      name: 'NayaPay',
      icon: <QrCode className="w-5 h-5" />,
      description: 'Pay with NayaPay QR code',
      qrCode: `NAYAPAY:PAY:${totalAmount}:${Date.now()}`
    },
    {
      id: 'sadapay',
      name: 'SadaPay',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay with SadaPay account',
      qrCode: `SADAPAY:PAY:${totalAmount}:${Date.now()}`
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleConfirm = () => {
    if (selectedMethod?.qrCode) {
      setShowQRCode(true);
    } else {
      onConfirm(paymentMethod);
    }
  };

  const handleQRPaymentComplete = () => {
    setShowQRCode(false);
    onConfirm(paymentMethod);
  };

  if (showQRCode && selectedMethod) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code to Pay</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-center">
            <Card className="p-4 bg-secondary/50">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-primary text-xl">PKR {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-semibold">{selectedMethod.name}</span>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                <QRCodeSVG
                  value={selectedMethod.qrCode || ''}
                  size={200}
                  level="H"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your {selectedMethod.name} app to complete payment
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowQRCode(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleQRPaymentComplete}
                className="flex-1 bg-gradient-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Payment Complete'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4 bg-secondary/50">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Tickets</span>
              <span className="font-semibold">{ticketCount} × PKR {(totalAmount / ticketCount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-primary text-xl">PKR {totalAmount.toLocaleString()}</span>
            </div>
          </Card>

          <div>
            <Label className="text-base font-semibold mb-4 block">Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="p-4 cursor-pointer hover:border-primary transition-colors">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="text-primary">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="cursor-pointer font-medium">
                            {method.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        {method.qrCode && (
                          <QrCode className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-primary"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : selectedMethod?.qrCode ? (
                'Generate QR Code'
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
