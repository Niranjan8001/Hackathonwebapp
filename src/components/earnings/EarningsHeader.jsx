import React, { useState } from 'react';
import { Download, Calendar, Loader2 } from 'lucide-react';
import { DateRangePicker } from '../ui/DateRangePicker';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { apiService } from '../../services/apiService';
import { useFarmerContext } from '../../context/FarmerContext';

export const EarningsHeader = () => {
  const [downloading, setDownloading] = useState(false);
  const { currentUser } = useFarmerContext();

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      const response = await apiService.getEarningsReport(token);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch report data');
      }

      const { orders, summary } = response.data;
      const doc = new jsPDF();

      // --- PDF STYLING & HEADER ---
      doc.setFontSize(22);
      doc.setTextColor(34, 197, 94); // Green color
      doc.text('FarmDirect', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Sustainable Agriculture Portal', 14, 26);

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('EARNINGS REPORT', 14, 40);

      doc.setFontSize(10);
      doc.text(`Farmer: ${currentUser?.name || 'User'}`, 14, 48);
      doc.text(`Email: ${currentUser?.email || 'N/A'}`, 14, 53);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 58);

      // --- SUMMARY SECTION ---
      doc.setDrawColor(230);
      doc.line(14, 65, 196, 65);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', 14, 75);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Orders: ${summary.totalOrders}`, 14, 82);
      doc.text(`Total Earnings: $${summary.totalEarnings.toLocaleString()}`, 14, 87);
      doc.text(`Pending Earnings: $${summary.pendingEarnings.toLocaleString()}`, 80, 87);
      doc.text(`Withdrawn: $${summary.withdrawnEarnings.toLocaleString()}`, 150, 87);

      // --- TABLE SECTION ---
      const tableColumn = ["Date", "Order ID", "Buyer", "Products", "Status", "Amount"];
      const tableRows = [];

      orders.forEach(order => {
        const orderData = [
          new Date(order.date).toLocaleDateString(),
          order.orderId.substring(order.orderId.length - 8).toUpperCase(),
          order.buyer,
          order.products.map(p => `${p.name} (x${p.qty})`).join(', '),
          order.status.charAt(0).toUpperCase() + order.status.slice(1),
          `$${order.amount.toLocaleString()}`
        ];
        tableRows.push(orderData);
      });

      if (tableRows.length === 0) {
        autoTable(doc, {
          head: [tableColumn],
          body: [['No earnings data available.', '', '', '', '', '']],
          startY: 95,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94] },
          styles: { fontSize: 8 }
        });
      } else {
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 95,
          theme: 'striped',
          headStyles: { fillColor: [34, 197, 94] },
          styles: { fontSize: 8 },
          columnStyles: {
            3: { cellWidth: 50 }, // Products column wider
          }
        });
      }

      // --- FOOTER ---
      const finalY = doc.lastAutoTable.finalY || 150;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('This is a computer-generated report and does not require a signature.', 14, finalY + 20);
      doc.text('© 2026 FarmDirect Inc. All rights reserved.', 14, finalY + 25);

      // --- SAVE FILE ---
      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`earnings-report-${dateStr}.pdf`);

    } catch (err) {
      console.error('Download Report Error:', err);
      alert(err.message || 'Failed to generate report');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative z-50 flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-4 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-white">Earnings</h1>
        <p className="text-sm text-white/30 font-medium tracking-wide">Track your income, transactions and withdrawals</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto pb-2">
        <button 
          onClick={handleDownloadReport}
          disabled={downloading}
          className={`flex-1 md:flex-none flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white/60 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-xl ${downloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin text-green-500" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloading ? 'Generating...' : 'Download Report'}</span>
        </button>
        
        <DateRangePicker />
      </div>
    </div>
  );
};
