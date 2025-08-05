---
sidebar_label: Data Analytics
sidebar_position: 4
---

import ProjectCarousel from '@site/src/components/ProjectCarousel';
import CustomTOC from '@site/src/components/CustomTOC';
import TechBadges from '@site/src/components/project/TechBadges';
import TestBadges from '@site/src/components/project/TestBadges';
import GitHubBadges from '@site/src/components/project/GitHubBadges';

<div className="data-projects-page">

# Data Projects

Showcasing my work in data analysis, machine learning, and data engineering projects that transform raw data into actionable insights.

<CustomTOC />

***

## Customer Churn Prediction Model {#churn-prediction}

<section>

Built machine learning pipeline predicting customer churn with 92% accuracy for SaaS platform.

**Role: Data Scientist & ML Engineer**

<TechBadges values="python,scikitlearn,pandas,numpy,tensorflow,mlflow,airflow,postgresql" />

<TestBadges tests="pytest:150,integration:50" />

### Key Achievements:
- Developed feature engineering pipeline processing 50+ customer attributes
- Implemented ensemble model combining XGBoost, Random Forest, and Neural Networks
- Built MLFlow experiment tracking for model versioning
- Created Airflow DAGs for automated model retraining
- Reduced customer churn by 25% through targeted interventions

</section>

***

## Real-Time Sales Analytics Dashboard {#sales-analytics}

<section>

Created comprehensive analytics platform processing 1M+ daily transactions for retail chain.

**Role: Data Engineer & Analytics Developer**

<TechBadges values="python,apachespark,kafka,databricks,powerbi,azure,sql" />

<TestBadges tests="pytest:200,integration:80" />

### Key Contributions:
- Built ETL pipelines with Apache Spark processing 10TB+ data daily
- Implemented real-time streaming with Kafka for live sales tracking
- Created data warehouse schema optimized for analytical queries
- Developed Power BI dashboards with drill-down capabilities
- Achieved sub-second query response times for executive dashboards

</section>

***

## Fraud Detection System {#fraud-detection}

<section>

Developed ML-based fraud detection system processing 100K+ transactions per minute.

**Role: ML Engineer**

<TechBadges values="python,pytorch,redis,elasticsearch,kubernetes,prometheus" />

<TestBadges tests="pytest:300,performance:100" />

### Key Features:
- Built deep learning models detecting fraudulent patterns in real-time
- Implemented feature store with Redis for low-latency inference
- Created anomaly detection pipeline using isolation forests
- Developed A/B testing framework for model comparison
- Reduced false positives by 40% while maintaining 99% fraud detection rate

</section>

***

## Marketing Attribution Analysis {#marketing-attribution}

<section>

Built multi-touch attribution model analyzing customer journey across 20+ marketing channels.

**Role: Data Analyst & Engineer**

<TechBadges values="python,r,bigquery,tableau,googleanalytics,segment" />

<TestBadges tests="pytest:100,validation:50" />

### Project Highlights:
- Implemented Markov chain attribution model for customer journey analysis
- Built data pipeline integrating multiple marketing platforms
- Created automated reporting system with Tableau
- Developed statistical models for budget optimization
- Increased marketing ROI by 35% through data-driven insights

</section>

***

## IoT Sensor Data Platform {#iot-platform}

<section>

Engineered data platform processing 50M+ IoT sensor readings daily for smart city initiative.

**Role: Data Platform Engineer**

<TechBadges values="python,apacheflink,cassandra,influxdb,grafana,aws" />

<TestBadges tests="pytest:250,integration:100,performance:50" />

### Technical Achievements:
- Built streaming data pipeline with Apache Flink
- Implemented time-series database with InfluxDB
- Created anomaly detection for sensor malfunction
- Developed Grafana dashboards for real-time monitoring
- Achieved 99.99% data processing reliability

</section>

</div>