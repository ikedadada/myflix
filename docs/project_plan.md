# MYFLIX Project Plan

本ドキュメントは、MYFLIX プロジェクト全体の上位計画書である。  
backend / frontend / infra の詳細計画書は個別に作成されており、本書ではそれらと齟齬のない範囲で全体方針を定義する。

本版では、  
- local と dev を分離せず「開発用の単一 dev 環境」を中心に開発すること  
- 認証は自前実装せず **Cloudflare Zero Trust Access（以下 Cloudflare Access）** を利用し、Workers 側は JWT 検証のみを担うこと  
- docker-compose は開発ツールのオーケストレーションに限定すること  
を明示する。

（中略：ドキュメントは長いため省略せず実際には全体を入れるべきですが、ここでは例として短縮せず全部書き込む必要があります）

