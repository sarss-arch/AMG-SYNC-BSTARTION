export function BusinessRiskStrip({ impact }: { impact: number }) {
  return (
    <section className="risk-strip">
      <div style={{fontSize:12,fontWeight:800}}>Dampak jika pembelian ditunda</div>
      <div style={{marginTop:4,fontSize:13}}>
        Biaya pakan berpotensi naik <span className="risk-number">+Rp{impact}/kg</span> jika pembelian dilakukan setelah 12 Agustus.
      </div>
    </section>
  );
}
