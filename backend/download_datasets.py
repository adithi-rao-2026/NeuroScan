import os
from pathlib import Path


DATASETS = [
    "rabieelkharoua/parkinsons-disease-dataset-analysis",
    "rabieelkharoua/alzheimers-disease-dataset",
]


def main() -> None:
    cache_dir = Path(__file__).resolve().parent / "data" / "kagglehub"
    cache_dir.mkdir(parents=True, exist_ok=True)
    os.environ["KAGGLEHUB_CACHE"] = str(cache_dir)

    import kagglehub

    for dataset in DATASETS:
        path = kagglehub.dataset_download(dataset)
        print(f"{dataset}: {path}")


if __name__ == "__main__":
    main()
